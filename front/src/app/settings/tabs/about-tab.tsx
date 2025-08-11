// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { BadgeInfo, ExternalLink, Github, Twitter, Heart, Star, GitBranch } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Markdown } from "~/components/unghost-agent/markdown";
import { cn } from "~/lib/utils";

import about from "./about.md";
import type { Tab } from "./types";

export const AboutTab: Tab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header with social links */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/30 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10 border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg backdrop-blur-sm"
      >
        <motion.div 
          className="text-5xl mb-2"
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          👻
        </motion.div>
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Unghost Agent
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            AI-powered personalized outreach automation
          </p>
        </div>
        
        {/* Social Links */}
        <div className="flex flex-col items-center space-y-4 mt-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="default"
              asChild
              className="group hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-200"
            >
              <a
                href="https://github.com/storyarcade/unghost"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                GitHub Repository
              </a>
            </Button>
            
            <Button
              variant="outline"
              size="default"
              asChild
              className="group hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              <a
                href="https://twitter.com/heypeter1111"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                @heypeter1111
              </a>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="h-4 w-4 text-green-500" />
              <span>MIT License</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Community Driven</span>
            </div>
          </div>
        </div>
        
        {/* Onboarding Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (typeof window !== "undefined" && (window as any).triggerOnboarding) {
              (window as any).triggerOnboarding();
            }
          }}
          className="mt-2 text-xs"
        >
          <BadgeInfo className="h-3 w-3 mr-1" />
          Run Onboarding Tutorial
        </Button>
      </motion.div>

      {/* Enhanced Markdown Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className={cn(
          "prose prose-slate dark:prose-invert max-w-none",
          "prose-headings:scroll-m-20 prose-headings:tracking-tight",
          "prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6",
          "prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4",
          "prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3",
          "prose-p:leading-7 prose-p:mb-4",
          "prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all",
          "prose-strong:font-semibold",
          "prose-ul:mb-4 prose-li:mb-1",
          "prose-hr:border-border prose-hr:my-8",
          "prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:my-6"
        )}
      >
        <Markdown animated checkLinkCredibility>
          {about}
        </Markdown>
      </motion.div>

      {/* Footer with additional links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-border/50"
      >
        <div className="flex flex-wrap gap-4 items-center justify-center text-sm text-muted-foreground">
          <span>💝 Made with love for the open source community</span>
          <span>•</span>
          <a
            href="https://github.com/storyarcade/unghost/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            📜 MIT License
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

AboutTab.icon = BadgeInfo;
AboutTab.displayName = "About";
