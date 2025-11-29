export function buildCombinedPrompt({
  prompt,
  genre,
  tone,
}: {
  prompt: string;
  genre: string;
  tone: string;
}) {
  return `
Game idea: ${prompt}
Genre: ${genre || "Any"}
Tone: ${tone || "Any"}

Your task is to deeply elaborate on this idea from three professional viewpoints:
- Game Designer
- Gameplay Engineer
- Concept Artist

Write rich, multi-sentence paragraphs and avoid vague one-liners.
Every field must contain meaningful detail, concrete examples, and imaginative specifics.

Return ONLY valid JSON in this exact schema and nothing else:

{
  "genre": "<the genre passed in>",
  "tone": "<the tone passed in>",
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

Instructions for quality:
- "coreFantasy" should be 2–4 sentences with specific thematic and emotional framing.
- "coreLoop" should be 2–3 sentences describing repeated player actions with clarity.
- "mechanics" should include 3–6 detailed mechanic ideas.
- Engineer sections must describe systems with purposeful reasoning and 2–4 sentence explanations.
- Artist sections must describe atmosphere, tone, and visual direction with specificity.
- Do not use placeholders like “the player does X” — be concrete.

Only output valid JSON following the schema above.
`;
}
