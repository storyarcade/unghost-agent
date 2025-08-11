// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, User, Target, ChevronRight } from "lucide-react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useSettingsStore, saveSettings } from "~/core/store/settings-store";

type OnboardingStep = "welcome" | "profile" | "goals" | "complete";

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    background: "",
    goals: "",
  });

  const userBackground = useSettingsStore((state) => state.general.userBackground);
  
  // Expose function to manually trigger onboarding for testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).triggerOnboarding = () => {
        localStorage.removeItem("unghost-onboarding-completed");
        setOpen(true);
        setCurrentStep("welcome");
      };
    }
  }, []);

  useEffect(() => {
    // Show onboarding if user background is empty
    if (!userBackground && typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem("unghost-onboarding-completed");
      if (!hasSeenOnboarding) {
        setOpen(true);
      }
    }
  }, [userBackground]);

  const handleNext = () => {
    const steps: OnboardingStep[] = ["welcome", "profile", "goals", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1] as OnboardingStep);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("unghost-onboarding-completed", "true");
    setOpen(false);
  };

  const handleComplete = () => {
    // Construct the user background from form data
    const background = `
${formData.name ? `Name: ${formData.name}` : ""}
${formData.title ? `Title: ${formData.title}` : ""}
${formData.company ? `Company: ${formData.company}` : ""}
${formData.background ? `\nBackground:\n${formData.background}` : ""}
${formData.goals ? `\nGoals:\n${formData.goals}` : ""}
    `.trim();

    // Update settings
    useSettingsStore.setState((state) => ({
      general: {
        ...state.general,
        userBackground: background,
      },
    }));
    saveSettings();
    
    localStorage.setItem("unghost-onboarding-completed", "true");
    setOpen(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome to Unghost Agent! 👻</h2>
              <p className="text-sm text-muted-foreground">
                Let's set up your profile to personalize your outreach experience.
                This will help us craft messages that sound authentically like you.
              </p>
            </div>
            <div className="flex flex-col items-center py-8 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              <p className="text-center text-muted-foreground max-w-md">
                This quick setup will help Unghost Agent understand your professional context
                and create more effective, personalized outreach messages.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="ghost" 
                onClick={handleSkip} 
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
              <Button onClick={handleNext}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );

      case "profile":
        return (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground">
                Basic information to personalize your outreach
              </p>
            </div>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="Sales Manager, CEO, Marketing Director..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background">Professional Background</Label>
                <Textarea
                  id="background"
                  placeholder="Brief description of your experience, industry, and what makes you unique..."
                  className="min-h-[100px]"
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("welcome")}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );

      case "goals":
        return (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">What are your outreach goals?</h2>
              <p className="text-sm text-muted-foreground">
                Help us understand what you want to achieve
              </p>
            </div>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goals">Outreach Goals & Objectives</Label>
                <Textarea
                  id="goals"
                  placeholder="Examples:
- Generate qualified leads for B2B software
- Build partnerships with industry leaders
- Connect with potential investors
- Recruit top talent for my team
- Expand network in specific industries..."
                  className="min-h-[200px]"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> The more specific you are about your goals, 
                  the better Unghost Agent can tailor outreach messages to achieve them.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("profile")}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Complete Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );

      case "complete":
        return (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">You're all set! 🎉</h2>
              <p className="text-sm text-muted-foreground">
                Your profile has been configured successfully
              </p>
            </div>
            <div className="flex flex-col items-center py-8 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              <div className="text-center space-y-2 max-w-md">
                <p className="font-medium">Your profile is ready!</p>
                <p className="text-sm text-muted-foreground">
                  Unghost Agent will now use your professional background to create 
                  personalized outreach messages that sound authentically like you.
                </p>
                <p className="text-sm text-muted-foreground pt-2">
                  You can update your profile anytime in the settings.
                </p>
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={handleComplete} className="w-full">
                Start Using Unghost Agent
              </Button>
            </div>
          </>
        );
    }
  };

  // Add keyboard listener for escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleSkip();
      } else {
        setOpen(newOpen);
      }
    }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content 
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%]",
            "gap-4 rounded-lg border bg-background/95 backdrop-blur-sm p-6 shadow-xl duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Unghost Agent Onboarding
          </DialogPrimitive.Title>
          <DialogPrimitive.Close 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Skip</span>
          </DialogPrimitive.Close>
          {renderStep()}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p className="text-xs text-muted-foreground/60">
              Press ESC to skip • Click outside to dismiss
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}