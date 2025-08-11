// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { MessageSquare, Users, Brain, Zap, Target } from "lucide-react";

import { cn } from "~/lib/utils";

import { SectionHeader } from "../components/section-header";

const features = [
  {
    Icon: MessageSquare,
    name: "AI-Personalized Messaging",
    description:
      "Transform cold prospects into warm conversations with deeply personalized messages that demonstrate genuine research and understanding of each recipient.",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Zap,
    name: "Multi-Style Tone Generation",
    description:
      "Choose from Aggressive, Conservative, Go Nuts, or Friendly writing styles to match your brand voice and recipient preferences perfectly.",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Brain,
    name: "Deep Persona Research",
    description:
      "Uncover professional insights, communication styles, recent activities, and pain points to craft messages that truly resonate.",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Target,
    name: "Strategic Outreach Planning",
    description:
      "AI-powered analysis identifies optimal timing, communication channels, and value propositions for maximum response rates.",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Users,
    name: "Relationship Intelligence",
    description:
      "Discover mutual connections, shared experiences, and common interests to build authentic rapport from the first message.",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
];

// Non-clickable feature card component
function FeatureCard({ Icon, name, description, background, className }: {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  background: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={cn(
        "non-clickable group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        // Dark theme styles
        "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 border border-slate-700/50",
        "shadow-2xl shadow-indigo-500/10 backdrop-blur-sm",
        // Hover effects
        "transition-all duration-300 ease-in-out hover:shadow-indigo-500/20 hover:border-indigo-500/30",
        className,
      )}
    >
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:scale-[1.02]">
        <Icon className="h-12 w-12 origin-left transform-gpu text-indigo-400 transition-all duration-300 ease-in-out group-hover:scale-75 group-hover:text-indigo-300" />
        <h3 className="text-xl font-semibold text-slate-100 group-hover:text-white transition-colors duration-300">
          {name}
        </h3>
        <p className="max-w-lg text-slate-300 group-hover:text-slate-200 transition-colors duration-300">{description}</p>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-indigo-500/[.05]" />
      {background}
    </div>
  );
}

export function CoreFeatureSection() {
  return (
    <section className="relative flex w-full flex-col content-around items-center justify-center">
      <SectionHeader
        anchor="core-features"
        title="Core Features"
        description="Discover what makes Unghost Agent the ultimate cold outreach companion."
      />
      <div className="w-3/4 grid auto-rows-[14rem] grid-cols-3 gap-4 lg:grid-cols-2 lg:grid-rows-3">
        {features.map((feature) => (
          <FeatureCard key={feature.name} {...feature} />
        ))}
      </div>
    </section>
  );
}
