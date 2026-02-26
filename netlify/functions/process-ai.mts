import { GoogleGenAI, Type } from "@google/genai";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { parts } = await req.json();

    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No content parts provided." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: `Você é um assistente de Backoffice ERP (SAP).
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
4. O objetivo é que o PREÇO UNITÁRIO nunca seja "0,00" se houver um valor total na linha ou no documento.`,
        responseMimeType: "application/json",
        responseSchema: {
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
                  detalhes: { type: Type.STRING, description: "Especificações extras, normas, referências ou tamanhos." },
                },
                required: ["descricao", "quantidade", "unidade"],
              },
            },
          },
        },
      },
    });

    const text = result.text;
    if (!text) {
      return new Response(
        JSON.stringify({ error: "A IA não retornou nenhum texto." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: `AI processing failed: ${message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
