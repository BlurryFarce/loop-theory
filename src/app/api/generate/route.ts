import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

export async function POST(req: Request) {
  try {
    const { prompt, genre, tone } = await req.json();

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Prompt too short" },
        { status: 400 }
      );
    }

    const userGenre = genre || "Any";
    const userTone = tone || "Any";

    const systemPrompt = `
You are an AI that outputs ONLY valid JSON.
You NEVER include commentary, markdown, or stray characters.
You MUST include the exact genre and tone provided by the user.
`;

    const userInstruction = `
Game idea: ${prompt}
Genre: ${userGenre}
Tone: ${userTone}

Respond ONLY with valid JSON in this exact format:

{
  "genre": "${userGenre}",
  "tone": "${userTone}",
  "designer": {
    "title": string,
    "coreFantasy": string,
    "coreLoop": string,
    "mechanics": string[]
  },
  "engineer": {
    "summary": string,
    "systems": string[],
    "challenges": string
  },
  "artist": {
    "summary": string,
    "imagery": string,
    "references": string[],
    "palette": string
  }
}
`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInstruction },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from model" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return NextResponse.json(
        { error: "Model returned invalid JSON", raw: content },
        { status: 500 }
      );
    }

    parsed.genre = userGenre;
    parsed.tone = userTone;

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: "Unhandled server error", details: String(err) },
      { status: 500 }
    );
  }
}
