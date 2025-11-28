import { NextResponse } from "next/server";
import { groq, MODEL } from "@/lib/groq";
import { buildPrompt } from "@/lib/prompts/combinedPrompt";

export async function POST(req: Request) {
  try {
    const { prompt, genre, tone } = await req.json();

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Prompt too short" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are an AI that outputs ONLY valid JSON.
No explanations.
No markdown.
Never include extra characters.
`;

    const userPrompt = buildPrompt(prompt, genre, tone);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from model" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON", raw },
        { status: 500 }
      );
    }

    // Ensure genre/tone are always included correctly
    parsed.genre = genre || "Any";
    parsed.tone = tone || "Any";

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: "Unhandled server error", details: String(err) },
      { status: 500 }
    );
  }
}
