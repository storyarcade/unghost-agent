// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { MultiAgentVisualization } from "../components/multi-agent-visualization";
import { SectionHeader } from "../components/section-header";

export function MultiAgentSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-24 rounded-3xl border border-slate-800/50">
      <SectionHeader
        anchor="outreach-workflow"
        title="AI-Powered Outreach Workflow"
        description="Watch how our specialized AI agents collaborate to create highly personalized cold outreach that breaks through the noise and drives responses."
      />
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <div className="h-full w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl">
          <MultiAgentVisualization />
        </div>
      </div>
      
      {/* Process Steps */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
          <h3 className="text-xl font-semibold text-slate-100">Research & Intel</h3>
          <p className="text-slate-300">Our Researcher and Strategizer gather deep insights about your prospect, their company, and communication preferences from LinkedIn, social media, and public sources.</p>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
          <h3 className="text-xl font-semibold text-slate-100">Strategy & Planning</h3>
          <p className="text-slate-300">The Planner analyzes all gathered data to create a personalized outreach strategy, identifying the best messaging approach and optimal timing.</p>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
          <h3 className="text-xl font-semibold text-slate-100">Message Creation</h3>
          <p className="text-slate-300">The Reporter crafts your final outreach message, incorporating all research and strategic insights to maximize response probability.</p>
        </div>
      </div>
    </section>
  );
}
