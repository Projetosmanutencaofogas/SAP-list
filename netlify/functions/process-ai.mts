import { GoogleGenAI, Type } from "@google/genai";
import type { Context } from "@netlify/functions";

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

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    materiais: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          descricao: { type: Type.STRING, description: "Descrição principal/nome em MAIÚSCULAS." },
          quantidade: { type: Type.NUMBER, description: "Quantidade (mínimo 1)." },
          unidade: { type: Type.STRING, description: "Unidade de medida (ex: UN, PAR, PC, M, CX)." },
          preco: { type: Type.STRING, description: "Preço unitário calculado ou extraído (ex: '10,50')." },
          detalhes: { type: Type.STRING, description: "Especificações extras, normas, referências ou tamanhos." }
        },
        required: ["descricao", "quantidade", "unidade"]
      }
    }
  }
};

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY não configurada no servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { text, files } = body as {
      text?: string;
      files?: Array<{ data: string; mimeType: string }>;
    };

    const parts: any[] = [];

    if (text && text.trim()) {
      parts.push({ text });
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
      return new Response(
        JSON.stringify({ error: "Nenhum dado para processar." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: [{ parts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const resultText = result.text;
    if (!resultText) {
      return new Response(
        JSON.stringify({
          error: "A IA não retornou nenhum texto. Tente reformular o pedido ou use uma imagem mais clara.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const jsonResult = JSON.parse(resultText);

    return new Response(JSON.stringify(jsonResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Erro no processamento IA:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Erro interno ao processar com IA.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
