import type { Context } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Você é um assistente de Backoffice ERP (SAP).
Analise o texto e/ou imagens fornecidos e extraia a lista COMPLETA de itens, incluindo equipamentos, serviços, taxas, fretes e qualquer outro item cobrável.

REGRAS DE EXTRAÇÃO:
1. MANTENHA A DESCRIÇÃO PRINCIPAL (descricao) clara em MAIÚSCULAS.
2. COLOQUE OS DETALHES TÉCNICOS ADICIONAIS na propriedade 'detalhes'.
3. NÃO IGNORE NENHUMA SEÇÃO. Se houver tabelas separadas para "Equipamentos" e "Taxas/Serviços", extraia itens de AMBAS.
4. QUANTIDADE: Se a quantidade for 0 ou não informada, use 1.

REGRAS PARA UNIDADE DE MEDIDA (UM):
1. Se o documento indicar a unidade (ex: "PC", "peças", "UN", "unidades", "PAR", "pares", "M", "metros", "LT", "litros"), USE A UNIDADE INFORMADA.
2. Formate a saída com siglas SAP: 'PC', 'UN', 'PAR', 'M', 'CX', 'KG', 'LT'.
3. Para serviços ou taxas sem unidade clara, use 'UN'.

REGRAS PARA PREÇO:
1. Extraia o PREÇO UNITÁRIO (Unitário R$) e o PREÇO TOTAL (Total R$) de cada item.
2. Formate como string com vírgula para decimais (ex: "160,00").
3. Se o PREÇO UNITÁRIO for 0 ou não informado, mas houver um PREÇO TOTAL, calcule: Unitário = Total / Quantidade.
4. O objetivo é que o PREÇO UNITÁRIO nunca seja "0,00" se houver um valor total na linha ou no documento.`;

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 2000;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    materiais: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          descricao: {
            type: Type.STRING,
            description: "Descrição principal/nome em MAIÚSCULAS.",
          },
          quantidade: {
            type: Type.NUMBER,
            description: "Quantidade (mínimo 1).",
          },
          unidade: {
            type: Type.STRING,
            description: "Unidade de medida (ex: UN, PAR, PC, M, CX).",
          },
          preco: {
            type: Type.STRING,
            description: "Preço unitário calculado ou extraído (ex: '10,50').",
          },
          detalhes: {
            type: Type.STRING,
            description:
              "Especificações extras, normas, referências ou tamanhos.",
          },
        },
        required: ["descricao", "quantidade", "unidade"],
      },
    },
  },
};

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("429") ||
      msg.includes("resource exhausted") ||
      msg.includes("rate limit") ||
      msg.includes("quota")
    );
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(
  ai: GoogleGenAI,
  model: string,
  parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }>
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const responseText = result.text;
      if (!responseText) {
        throw new Error("A IA não retornou nenhum texto.");
      }
      return responseText;
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt + 1}/${MAX_RETRIES} with model ${model} failed:`, err);

      if (isRateLimitError(err) && attempt < MAX_RETRIES - 1) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        console.log(`Rate limited. Waiting ${backoff}ms before retry...`);
        await sleep(backoff);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { text, files } = body as {
      text?: string;
      files?: Array<{ data: string; mimeType: string }>;
    };

    const parts: Array<
      | { text: string }
      | { inlineData: { data: string; mimeType: string } }
    > = [];

    if (text && text.trim()) {
      parts.push({ text: text });
    }

    if (files && Array.isArray(files)) {
      for (const file of files) {
        parts.push({
          inlineData: {
            data: file.data,
            mimeType: file.mimeType,
          },
        });
      }
    }

    if (parts.length === 0) {
      return Response.json(
        { error: "Nenhum dado para processar." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({});

    let responseText: string | undefined;

    // Try each model in order — if the primary model is rate-limited, fall back
    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        responseText = await callGemini(ai, model, parts);
        break;
      } catch (err) {
        console.error(`Model ${model} failed:`, err);

        // If rate-limited on this model, try the next one
        if (isRateLimitError(err)) {
          console.log(`Rate limit hit on ${model}, trying next model...`);
          continue;
        }

        // For non-rate-limit errors, throw immediately
        throw err;
      }
    }

    if (!responseText) {
      return Response.json(
        {
          error:
            "O serviço de IA está temporariamente sobrecarregado. Por favor, aguarde alguns segundos e tente novamente.",
          retryable: true,
        },
        { status: 429 }
      );
    }

    const jsonResult = JSON.parse(responseText);
    return Response.json(jsonResult);
  } catch (err: unknown) {
    console.error("Gemini function error:", err);

    if (isRateLimitError(err)) {
      return Response.json(
        {
          error:
            "O serviço de IA está temporariamente sobrecarregado. Por favor, aguarde alguns segundos e tente novamente.",
          retryable: true,
        },
        { status: 429 }
      );
    }

    const message =
      err instanceof Error ? err.message : "Erro interno do servidor";
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config = {
  path: "/api/gemini",
};
