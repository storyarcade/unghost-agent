// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { MagicWandIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { BorderBeam } from "~/components/magicui/border-beam";
import { Button } from "~/components/ui/button";
import MessageInput, {
  type MessageInputRef,
} from "~/components/unghost-agent/message-input";
import { ReportStyleDialog } from "~/components/unghost-agent/report-style-dialog";
import { Tooltip } from "~/components/unghost-agent/tooltip";
import { enhancePrompt } from "~/core/api";
import type { Option, Resource } from "~/core/messages";
import { useSettingsStore } from "~/core/store";
import { cn } from "~/lib/utils";
import { TemplatesDialog } from "./templates-dialog";

export function InputBox({
  className,
  responding,
  feedback,
  onSend,
  onCancel,
  onRemoveFeedback,
}: {
  className?: string;
  size?: "large" | "normal";
  responding?: boolean;
  feedback?: { option: Option } | null;
  onSend?: (
    message: string,
    options?: {
      interruptFeedback?: string;
      resources?: Array<Resource>;
    },
  ) => void;
  onCancel?: () => void;
  onRemoveFeedback?: () => void;
}) {
  const reportStyle = useSettingsStore((state) => state.general.reportStyle);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<MessageInputRef>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Enhancement state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhanceAnimating, setIsEnhanceAnimating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    title: string;
    tone: string;
    use_case: string;
    prompt: string;
  } | null>(null);

  const handleSendMessage = useCallback(
    (message: string, resources: Array<Resource>) => {
      if (responding) {
        onCancel?.();
      } else {
        if (message.trim() === "") {
          return;
        }
        if (onSend) {
          // Send the message with selected template ID
          onSend(message, {
            interruptFeedback: feedback?.option.value,
            resources,
          });
          onRemoveFeedback?.();
          // Clear enhancement animation and template after sending
          setIsEnhanceAnimating(false);
          setSelectedTemplate(null);
        }
      }
    },
    [responding, onCancel, onSend, feedback, onRemoveFeedback, selectedTemplate],
  );

  const handleEnhancePrompt = useCallback(async () => {
    if (currentPrompt.trim() === "" || isEnhancing) {
      return;
    }

    setIsEnhancing(true);
    setIsEnhanceAnimating(true);

    try {
      const enhancedPrompt = await enhancePrompt({
        prompt: currentPrompt,
        report_style: reportStyle.toUpperCase(),
      });

      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the input with the enhanced prompt with animation
      if (inputRef.current) {
        inputRef.current.setContent(enhancedPrompt);
        setCurrentPrompt(enhancedPrompt);
      }

      // Keep animation for a bit longer to show the effect
      setTimeout(() => {
        setIsEnhanceAnimating(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to enhance prompt:", error);
      setIsEnhanceAnimating(false);
      // Could add toast notification here
    } finally {
      setIsEnhancing(false);
    }
  }, [currentPrompt, isEnhancing, reportStyle]);

  return (
    <div
      className={cn(
        "agentic-input-container relative flex h-full w-full flex-col shadow-lg",
        "border-2 border-border/30 hover:border-border/50 transition-all duration-300",
        className,
      )}
      ref={containerRef}
    >
      <div className="w-full flex-1">
        <AnimatePresence>
          {feedback && (
            <motion.div
              ref={feedbackRef}
              className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-2 border-blue-500/30 absolute top-0 left-0 mt-2 ml-4 flex items-center justify-center gap-2 rounded-full px-3 py-1 backdrop-blur-sm shadow-md"
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="text-blue-700 dark:text-blue-300 flex h-full w-full items-center justify-center text-sm font-medium">
                {feedback.option.text}
              </div>
              <X
                className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                size={16}
                onClick={onRemoveFeedback}
              />
            </motion.div>
          )}
          {isEnhanceAnimating && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full w-full">
                {/* Sparkle effect overlay */}
                <motion.div
                  className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                      "linear-gradient(225deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-blue-400"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [-10, -20, -10],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <MessageInput
          className={cn(
            "h-24 px-4 pt-5",
            feedback && "pt-9",
            isEnhanceAnimating && "transition-all duration-500",
          )}
          ref={inputRef}
          onEnter={handleSendMessage}
          onChange={setCurrentPrompt}
        />
      </div>
      <div className="flex items-center px-4 py-3 bg-gradient-to-b from-transparent to-card/30 gap-4">
        <div className="flex flex-1 gap-2 items-center">
          <div className="flex gap-2 items-center">
            <ReportStyleDialog />
            <TemplatesDialog onSelectTemplate={(template) => {
              setSelectedTemplate(template);
            }} />
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20"
              >
                <span className="text-xs font-medium text-primary">
                  Style: {selectedTemplate.title}
                </span>
                <X
                  className="h-3 w-3 cursor-pointer text-primary/60 hover:text-primary"
                  onClick={() => setSelectedTemplate(null)}
                />
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Tooltip title="Enhance prompt with AI">
            <Button
              variant="agentic-outline"
              size="icon"
              className={cn(
                "group relative h-11 w-11",
                isEnhancing && "animate-pulse shadow-xl",
              )}
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || currentPrompt.trim() === ""}
            >
              {isEnhancing ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-blue-600 border-r-purple-600" />
                </div>
              ) : (
                <MagicWandIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              )}
            </Button>
          </Tooltip>
          <Tooltip title={responding ? "Stop" : "Send"}>
            <Button
              variant="agentic"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full shadow-xl hover:shadow-2xl group",
                responding && "animate-pulse bg-red-500 hover:bg-red-600",
              )}
              onClick={() => inputRef.current?.submit()}
            >
              {responding ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-5 w-5 rounded bg-white" />
                </div>
              ) : (
                <ArrowUp className="h-5 w-5 text-white group-hover:translate-y-[-2px] transition-transform" />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
      {isEnhancing && (
        <>
          <BorderBeam
            duration={5}
            size={250}
            className="from-transparent via-red-500 to-transparent"
          />
          <BorderBeam
            duration={5}
            delay={3}
            size={250}
            className="from-transparent via-blue-500 to-transparent"
          />
        </>
      )}
    </div>
  );
}
