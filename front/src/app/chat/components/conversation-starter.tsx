// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { Ghost, Sparkles, Target, Users } from "lucide-react";

import { cn } from "~/lib/utils";

import { Welcome } from "./welcome";

const questions = [
  {
    text: "Help me unghost a VC for my AI startup pitch deck review",
    icon: <Target className="h-5 w-5 text-indigo-400" />,
    gradient: "from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30",
    border: "hover:border-indigo-200 dark:hover:border-indigo-800"
  },
  {
    text: "Create irresistible LinkedIn outreach to marketing leaders in SaaS",
    icon: <Users className="h-5 w-5 text-purple-400" />,
    gradient: "from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30",
    border: "hover:border-purple-200 dark:hover:border-purple-800"
  },
  {
    text: "Write a reconnection message that gets responses from old colleagues", 
    icon: <Sparkles className="h-5 w-5 text-cyan-400" />,
    gradient: "from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30",
    border: "hover:border-cyan-200 dark:hover:border-cyan-800"
  },
  {
    text: "Draft personalized sales outreach that converts cold prospects to meetings",
    icon: <Ghost className="h-5 w-5 text-violet-400" />,
    gradient: "from-violet-50/50 to-indigo-50/50 dark:from-violet-950/30 dark:to-indigo-950/30",
    border: "hover:border-violet-200 dark:hover:border-violet-800"
  },
];

export function ConversationStarter({
  className,
  onSend,
}: {
  className?: string;
  onSend?: (message: string) => void;
}) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <Welcome className="pointer-events-auto mb-15 w-[75%] -translate-y-24" />
      </div>
      
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Ghost className="h-6 w-6 text-indigo-400" />
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
            Stop Getting Ghosted
          </h3>
          <Ghost className="h-6 w-6 text-indigo-400" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-600 dark:text-slate-400 max-w-md mx-auto"
        >
          Try these unghosting scenarios or describe your own outreach challenge
        </motion.p>
      </div>
      
      <ul className="flex flex-wrap max-w-4xl">
        {questions.map((question, index) => (
          <motion.li
            key={question.text}
            className="flex w-1/2 shrink-0 p-3 active:scale-105"
            style={{ transition: "all 0.2s ease-out" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 + 0.7,
              ease: "easeOut",
            }}
          >
            <div
              className={cn(
                "bg-card/80 backdrop-blur-sm text-muted-foreground cursor-pointer rounded-2xl border-2 border-border/50 px-6 py-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-border/80",
                question.border,
                "group relative overflow-hidden shadow-md"
              )}
              style={{
                background: `linear-gradient(135deg, rgb(var(--card) / 0.8), rgb(var(--card) / 0.6))`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${question.gradient.includes('indigo') ? 'rgba(99, 102, 241, 0.1)' : question.gradient.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : question.gradient.includes('cyan') ? 'rgba(6, 182, 212, 0.1)' : 'rgba(139, 92, 246, 0.1)'}, rgb(var(--card) / 0.9))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, rgb(var(--card) / 0.8), rgb(var(--card) / 0.6))`;
              }}
              onClick={() => {
                onSend?.(question.text);
              }}
            >
              {/* Subtle ghost pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDVDNy41IDUgNSA3LjUgNSAxMFYxNUw3LjUgMTIuNUwxMCAxNUwxMi41IDEyLjVMMTUgMTVWMTBDMTUgNy41IDEyLjUgNSAxMCA1WiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxjaXJjbGUgY3g9IjgiIGN5PSI5IiByPSIxIiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K')] bg-repeat pointer-events-none" />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300 shadow-inner">
                  {question.icon}
                </div>
                <span className="text-sm leading-relaxed font-semibold group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors">
                  {question.text}
                </span>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur-xl" />
              <div className="absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-2xl -z-10" />
            </div>
          </motion.li>
        ))}
      </ul>
      
      {/* Bottom tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-2">
          <Sparkles className="h-3 w-3" />
          <span>AI-powered research • Personalized messaging • Higher response rates</span>
          <Sparkles className="h-3 w-3" />
        </p>
      </motion.div>
    </div>
  );
}
