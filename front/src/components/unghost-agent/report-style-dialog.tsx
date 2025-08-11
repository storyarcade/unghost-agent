// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { useState } from "react";
import { Check, Zap, Shield, Rocket, Heart } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { setReportStyle, useSettingsStore } from "~/core/store";
import { cn } from "~/lib/utils";

import { Tooltip } from "./tooltip";

const REPORT_STYLES = [
  {
    value: "aggressive" as const,
    label: "Aggressive",
    description: "Bold, direct, and confident - cuts straight to the point",
    icon: Zap,
  },
  {
    value: "conservative" as const,
    label: "Conservative",
    description: "Careful, measured, and diplomatic - builds trust gradually",
    icon: Shield,
  },
  {
    value: "go_nuts" as const,
    label: "Go Nuts",
    description: "Creative, energetic, and wildly memorable - breaks all rules",
    icon: Rocket,
  },
  {
    value: "friendly" as const,
    label: "Friendly",
    description: "Warm, approachable, and empathetic - builds genuine connections",
    icon: Heart,
  },
];

export function ReportStyleDialog() {
  const [open, setOpen] = useState(false);
  const currentStyle = useSettingsStore((state) => state.general.reportStyle);

  const handleStyleChange = (
    style: "aggressive" | "conservative" | "go_nuts" | "friendly",
  ) => {
    setReportStyle(style);
    setOpen(false);
  };

  const currentStyleConfig =
    REPORT_STYLES.find((style) => style.value === currentStyle) ||
    REPORT_STYLES[0]!;
  const CurrentIcon = currentStyleConfig.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip
        className="max-w-60"
        title={
          <div>
            <h3 className="mb-2 font-bold">
              Writing Style: {currentStyleConfig.label}
            </h3>
            <p>
              Choose the writing style for your outreach messages. Different
              styles are optimized for different audiences and purposes.
            </p>
          </div>
        }
      >
        <DialogTrigger asChild>
          <Button
            className="rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-2 border-blue-500/30 hover:border-blue-500/50 hover:from-blue-500/20 hover:to-purple-600/20 text-blue-700 dark:text-blue-300 font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
            variant="outline"
          >
            <CurrentIcon className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" /> 
            {currentStyleConfig.label}
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Writing Style</DialogTitle>
          <DialogDescription>
            Select the writing style for your outreach messages. Each style is
            optimized for different audiences and purposes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {REPORT_STYLES.map((style) => {
            const Icon = style.icon;
            const isSelected = currentStyle === style.value;

            return (
              <button
                key={style.value}
                className={cn(
                  "hover:bg-accent flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                  isSelected && "border-primary bg-accent",
                )}
                onClick={() => handleStyleChange(style.value)}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{style.label}</h4>
                    {isSelected && <Check className="text-primary h-4 w-4" />}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {style.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
