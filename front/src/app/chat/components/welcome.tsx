// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import React from "react";
import { WelcomeCard } from "~/components/unghost-agent/welcome-card";

export function Welcome({ className }: { className?: string }) {
  return (
    <WelcomeCard
      className={className}
      title={
        <>
          👋 Hello, there!
        </>
      }
      description={
        <>
          Welcome to {" "}
          <a
            href="https://github.com/storyarcade/unghost"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:underline transition-all duration-200 hover:scale-105 inline-block"
          >
            👻 Unghost Agent
          </a>
          , an AI-powered personalized outreach assistant built on cutting-edge language models that helps
          you generate leads, research prospects, and create personalized messages with intelligent automation.
        </>
      }
    />
  );
}