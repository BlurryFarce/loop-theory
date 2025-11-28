"use client";

import React, { useEffect, useState } from "react";
import {
  ArtistResponse,
  DesignerResponse,
  EngineerResponse,
  Genre,
  IdeaResult,
  SavedIdea,
  Tone,
} from "@/types/idea";

import { motion } from "framer-motion";

const GENRES: Genre[] = [
  "Puzzle",
  "RPG",
  "Roguelike",
  "Platformer",
  "Co-op",
  "Horror",
  "Narrative",
  "Other",
];

const TONES: Tone[] = ["Cozy", "Dark", "Surreal", "Comedic", "Epic", "Other"];

const LOCAL_STORAGE_KEY = "mini-game-idea-studio-history";

function loadHistory(): SavedIdea[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedIdea[];
  } catch {
    return [];
  }
}

function saveHistory(history: SavedIdea[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
}

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState<Genre | "">("");
  const [tone, setTone] = useState<Tone | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<IdeaResult | null>(null);
  const [history, setHistory] = useState<SavedIdea[]>([]);

  useEffect(() => {
    const initial = loadHistory();
    setHistory(initial);
  }, []);

  const handleGenerate = async () => {
    setError(null);
    if (!prompt.trim()) {
      setError("Please type a game idea first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, genre, tone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const data = (await res.json()) as IdeaResult;
      setCurrentResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!currentResult) return;
    const id = crypto.randomUUID();
    const saved: SavedIdea = {
      ...currentResult,
      genre,
      tone,
      id,
    };

    const updated = [saved, ...history];
    setHistory(updated);
    saveHistory(updated);
  };

  const handleLoadFromHistory = (idea: SavedIdea) => {
    setPrompt(idea.prompt);
    setGenre(idea.genre);
    setTone(idea.tone);
    setCurrentResult(idea);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <main className="min-h-screen bg-slate-950/60 text-slate-100 flex flex-col relative">
      <header className="border-b border-slate-800 px-6 py-5 flex items-center justify-between bg-slate-950/70 backdrop-blur-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-violet-400">∞ </span>
            loop<span className="text-violet-400">;theory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            multi-perspective game concept generator
          </p>
        </div>
      </header>

      <div className="h-[px] bg-gradient-to-r from-transparent via-violet-600/40 to-transparent"></div>

      <div className="flex flex-1 flex-col md:flex-row bg-gradient-to-b from-slate-950 to-slate-900">
        <section className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Game idea</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder='For example: "Co-op puzzle game in a floating city with time travel"'
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre | "")}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Any</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone | "")}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Any</option>
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-all shadow-md shadow-violet-600/20
    ${loading ? "animate-pulse" : "hover:bg-violet-500"}
  `}
          >
            {loading ? "Generating…" : "Generate"}
          </button>

          {currentResult && (
            <button
              onClick={handleSave}
              className="ml-2 inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
            >
              Save idea
            </button>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-200">History</h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
            {history.length === 0 && (
              <p className="text-xs text-slate-500">
                Saved ideas will show up here.
              </p>
            )}
            <ul className="space-y-1 max-h-64 overflow-auto pr-1">
              {history.map((idea) => (
                <li key={idea.id}>
                  <button
                    onClick={() => handleLoadFromHistory(idea)}
                    className="w-full text-left text-xs rounded-md px-3 py-2 bg-slate-900/50 border border-slate-800 hover:border-teal-400/40 hover:bg-slate-900 transition-colors"
                  >
                    <div className="font-medium text-slate-200">
                      {idea.designer.title || "Untitled idea"}
                    </div>
                    <div className="text-slate-500">
                      {idea.genre || "Any"} · {idea.tone || "Any"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="md:w-2/3 p-6 space-y-4 overflow-auto">
          {!currentResult && (
            <div className="h-full flex items-center justify-center text-sm text-slate-500 text-center">
              Type a game idea on the left and generate to see the Designer,
              Engineer, and Artist perspectives.
            </div>
          )}

          {currentResult && (
            <>
              <div className="mb-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Current idea
                </p>
                <h2 className="text-lg font-semibold">
                  {currentResult.designer.title || "Untitled idea"}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  {currentResult.prompt}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {currentResult.genre || "Any genre"} · {currentResult.tone || "Any tone"}
                </p>
              </div>

              <motion.div
                key={currentResult.createdAt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid gap-4 md:grid-cols-3"
              >
                <RoleCard
                  role="Designer"
                  accent="from-violet-500/20 to-violet-500/0"
                  icon="🎮"
                >
                  <DesignerView data={currentResult.designer} />
                </RoleCard>

                <RoleCard
                  role="Engineer"
                  accent="from-sky-500/20 to-sky-500/0"
                  icon="⚙️"
                >
                  <EngineerView data={currentResult.engineer} />
                </RoleCard>

                <RoleCard
                  role="Artist"
                  accent="from-rose-500/20 to-rose-500/0"
                  icon="🎨"
                >
                  <ArtistView data={currentResult.artist} />
                </RoleCard>
              </motion.div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

type RoleCardProps = {
  role: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
};

function RoleCard({ role, icon, accent, children }: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-sm shadow-xl overflow-hidden group"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b ${accent}`}
      ></div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <h3 className="font-semibold tracking-wide">{role}</h3>
        </div>
        {children}
      </div>

      <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover:border-violet-500/30 transition-colors duration-300" />
    </motion.div>
  );
}

function DesignerView({ data }: { data: DesignerResponse }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-slate-400">Core fantasy</p>
      <p>{data.coreFantasy}</p>

      <p className="text-xs uppercase text-slate-400 mt-2">Core loop</p>
      <p>{data.coreLoop}</p>

      {data.mechanics?.length > 0 && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Key mechanics</p>
          <ul className="list-disc list-inside space-y-1">
            {data.mechanics.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function EngineerView({ data }: { data: EngineerResponse }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-slate-400">Technical overview</p>
      <p>{data.summary}</p>

      {data.systems?.length > 0 && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Core systems</p>
          <ul className="list-disc list-inside space-y-1">
            {data.systems.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}

      {data.challenges && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Challenges</p>
          <p>{data.challenges}</p>
        </>
      )}
    </div>
  );
}

function ArtistView({ data }: { data: ArtistResponse }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-slate-400">Mood and atmosphere</p>
      <p>{data.summary}</p>

      {data.imagery && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Key imagery</p>
          <p>{data.imagery}</p>
        </>
      )}

      {data.references?.length > 0 && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">
            Visual references
          </p>
          <ul className="list-disc list-inside space-y-1">
            {data.references.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}

      {data.palette && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Palette</p>
          <p>{data.palette}</p>
        </>
      )}
    </div>
  );
}
