"use client";

import { motion } from "framer-motion";
import React from "react";

export type RoleCardProps = {
  role: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
};

export default function RoleCard({
  role,
  icon,
  accent,
  children,
}: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-sm shadow-xl overflow-hidden group"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b ${accent}`}
      />

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
