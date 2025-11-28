"use client";

import React, { useEffect, useState } from "react";
import {
  Genre,
  IdeaResult,
  SavedIdea,
  Tone,
} from "@/types/idea";

import RoleCard from "@/components/RoleCard";
import DesignerView from "@/components/DesignerView";
import EngineerView from "@/components/EngineerView";
import ArtistView from "@/components/ArtistView";

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

const LOCAL_STORAGE_KEY = "loop-theory-history";

function loadHistory(): SavedIdea[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedIdea[]) : [];
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
    setHistory(loadHistory());
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
            <span className="text-violet-400">∞</span>
            loop<span className="text-violet-400">-theory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            multi-perspective game concept generator
          </p>
        </div>
      </header>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-600/40 to-transparent"></div>

      <div className="flex flex-1 flex-col md:flex-row bg-gradient-to-b from-slate-950 to-slate-900">
        <section className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Game idea</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder={`For example: "Co-op puzzle game in a floating city with time travel"`}
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
            className={`inline-flex items-center justify-center rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-all shadow-md shadow-violet-600/20 ${
              loading ? "animate-pulse" : "hover:bg-violet-500"
            }`}
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
                  {currentResult.genre} · {currentResult.tone}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <RoleCard
                  role="Designer"
                  icon="🎮"
                  accent="from-violet-500/20 to-violet-500/0"
                >
                  <DesignerView data={currentResult.designer} />
                </RoleCard>

                <RoleCard
                  role="Engineer"
                  icon="⚙️"
                  accent="from-sky-500/20 to-sky-500/0"
                >
                  <EngineerView data={currentResult.engineer} />
                </RoleCard>

                <RoleCard
                  role="Artist"
                  icon="🎨"
                  accent="from-rose-500/20 to-rose-500/0"
                >
                  <ArtistView data={currentResult.artist} />
                </RoleCard>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
