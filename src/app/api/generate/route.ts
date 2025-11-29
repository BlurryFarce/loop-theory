import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { buildCombinedPrompt } from "@/lib/prompts/combinedPrompt";

const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, genre, tone } = body;

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

    const combinedPrompt = buildCombinedPrompt({ prompt, genre, tone });

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.8,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You return ONLY valid JSON.
All fields must be detailed, multi-sentence, specific, and imaginative.
Never output explanations or commentary outside JSON.
`,
        },
        { role: "user", content: combinedPrompt },
      ],
    });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty LLM response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Unhandled server error", details: String(err) },
      { status: 500 }
    );
  }
}
