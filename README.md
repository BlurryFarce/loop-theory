# loop;theory  
_multi-perspective game concept generator_

Loop;theory is a compact full-stack prototype that explores how AI can support early-stage game ideation.  
Users provide a game idea along with an optional genre and tone, and the app generates three complementary perspectives:

- **Designer** – core fantasy, gameplay loop, mechanics  
- **Engineer** – systems, architecture, technical considerations  
- **Artist** – mood, imagery, palette, worldbuilding direction  

The result is a quick, playful snapshot of how different roles might think about the same concept.

---

## Project Intent

Loop-theory was created as a small, well-scoped project that demonstrates:

- clear full-stack structure

- modern frontend development practices

- thoughtful UX for a compact idea

- multi-agent prompting patterns

- a touch of creativity through game design themes

It is intentionally minimal, easy to read, and easy to extend.

---

## Features

- Generate three role-based AI perspectives from a single prompt  
- Clean, responsive dark UI with small interaction details  
- Card-based layout for each role  
- Local history panel for saving and revisiting ideas  
- Fast serverless API endpoint powered by Groq  
- Simple and focused codebase designed for clarity

---

## Tech Stack

- **Next.js (App Router)**  
- **React + TypeScript**  
- **Tailwind CSS**  
- **Groq LLM API**  
- **Vercel**  
- **LocalStorage** for idea persistence

---

## Running Locally

```bash
npm install
npm run dev
```

## License
MIT