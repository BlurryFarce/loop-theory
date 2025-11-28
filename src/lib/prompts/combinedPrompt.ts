export function buildPrompt(prompt: string, genre: string, tone: string) {
  const g = genre || "Any";
  const t = tone || "Any";

  return `
Game idea: ${prompt}
Genre: ${g}
Tone: ${t}

Respond ONLY with valid JSON in this exact format:

{
  "genre": "${g}",
  "tone": "${t}",
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
}
