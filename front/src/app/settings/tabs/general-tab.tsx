// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, User, Brain, Search, FileText, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { GlassmorphicCard } from "~/components/ui/glassmorphic-card";
import { cn } from "~/lib/utils";
import type { SettingsState } from "~/core/store";

import type { Tab } from "./types";

// Simplified schema to avoid deep type instantiation
const generalFormSchema = z.object({
  autoAcceptedPlan: z.boolean(),
  maxPlanIterations: z.number().min(1, "Max plan iterations must be at least 1."),
  maxStepNum: z.number().min(1, "Max step number must be at least 1."),
  maxSearchResults: z.number().min(1, "Max search results must be at least 1."),
  reportStyle: z.enum(["aggressive", "conservative", "go_nuts", "friendly"]),
  userBackground: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GeneralFormData = z.infer<typeof generalFormSchema>;

export const GeneralTab: Tab = ({
  settings,
  onChange,
}: {
  settings: SettingsState;
  onChange: (changes: Partial<SettingsState>) => void;
}) => {
  const generalSettings = useMemo(() => settings.general, [settings]);
  
  const form = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    mode: "onChange",
    defaultValues: generalSettings,
    reValidateMode: "onBlur" as const,
  });

  const currentSettings = form.watch();
  
  useEffect(() => {
    // Simple deep equality check for settings changes
    const hasChanges = JSON.stringify(currentSettings) !== JSON.stringify(settings.general);
    if (hasChanges) {
      // Create the update with explicit typing
      const generalUpdate: SettingsState["general"] = {
        autoAcceptedPlan: currentSettings.autoAcceptedPlan,
        maxPlanIterations: currentSettings.maxPlanIterations,
        maxStepNum: currentSettings.maxStepNum,
        maxSearchResults: currentSettings.maxSearchResults,
        reportStyle: currentSettings.reportStyle,
        userBackground: currentSettings.userBackground,
      };
      onChange({ general: generalUpdate });
    }
  }, [currentSettings, onChange, settings.general]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          General Settings
        </motion.h1>
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Configure your Unghost Agent preferences and behavior
        </motion.p>
      </header>
      <main>
        <Form {...form}>
          <form className="space-y-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassmorphicCard variant="interactive" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Professional Profile</h3>
                    <p className="text-sm text-muted-foreground">Tell us about yourself to personalize your outreach</p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="userBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I'm a B2B SaaS founder focusing on AI-powered solutions for enterprise customers..."
                          {...field}
                          className="min-h-[120px] glassmorphic resize-none"
                        />
                      </FormControl>
                      <FormDescription className="mt-2">
                        <Sparkles className="inline h-3 w-3 mr-1" />
                        This helps create authentic messages in your voice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </GlassmorphicCard>
            </motion.div>

            {/* AI Behavior Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassmorphicCard variant="interactive" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">AI Behavior</h3>
                    <p className="text-sm text-muted-foreground">Control how the AI plans and executes tasks</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="autoAcceptedPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <Label className="text-sm font-medium cursor-pointer" htmlFor="autoAcceptedPlan">
                                Automatic Plan Acceptance
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                Skip confirmation and execute plans immediately
                              </p>
                            </div>
                            <Switch
                              id="autoAcceptedPlan"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="ml-4"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxPlanIterations"
                      render={({ field }) => (
                        <FormItem className="p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                          <FormLabel className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            Plan Iterations
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              defaultValue={field.value}
                              min={1}
                              max={5}
                              onChange={(event) =>
                                field.onChange(parseInt(event.target.value || "0"))
                              }
                              className="mt-2"
                            />
                          </FormControl>
                          <FormDescription className="text-xs mt-1">
                            1 = single-step, 2+ = re-planning
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maxStepNum"
                      render={({ field }) => (
                        <FormItem className="p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                            Research Steps
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              defaultValue={field.value}
                              min={1}
                              max={10}
                              onChange={(event) =>
                                field.onChange(parseInt(event.target.value || "0"))
                              }
                              className="mt-2"
                            />
                          </FormControl>
                          <FormDescription className="text-xs mt-1">
                            Steps per research plan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Search Settings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassmorphicCard variant="interactive" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Search Configuration</h3>
                    <p className="text-sm text-muted-foreground">Fine-tune research depth and quality</p>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="maxSearchResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Search Results</FormLabel>
                      <div className="flex items-center gap-4 mt-2">
                        <FormControl>
                          <Input
                            type="number"
                            defaultValue={field.value}
                            min={1}
                            max={20}
                            onChange={(event) =>
                              field.onChange(parseInt(event.target.value || "0"))
                            }
                            className="w-32"
                          />
                        </FormControl>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              initial={{ width: "0%" }}
                              animate={{ width: `${(field.value / 20) * 100}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                      <FormDescription className="mt-2">
                        More results = deeper research but slower processing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </GlassmorphicCard>
            </motion.div>
          </form>
        </Form>
      </main>
    </div>
  );
};

GeneralTab.displayName = "General";
GeneralTab.icon = Settings;
