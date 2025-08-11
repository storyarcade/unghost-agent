// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  Download,
  Headphones,
  ChevronDown,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import { LoadingAnimation } from "~/components/unghost-agent/loading-animation";
import { Markdown } from "~/components/unghost-agent/markdown";
import { RainbowText } from "~/components/unghost-agent/rainbow-text";
import { RollingText } from "~/components/unghost-agent/rolling-text";
import {
  ScrollContainer,
  type ScrollContainerRef,
} from "~/components/unghost-agent/scroll-container";
import { Tooltip } from "~/components/unghost-agent/tooltip";
import type { Message, Option } from "~/core/messages";
import {
  closeResearch,
  openResearch,
  useLastFeedbackMessageId,
  useLastInterruptMessage,
  useMessage,
  useMessageIds,
  useResearchMessage,
  useStore,
} from "~/core/store";
import { parseJSON } from "~/core/utils";
import { cn } from "~/lib/utils";

import { ResearchBlock } from "./research-block";
import { ResearchReportBlock } from "./research-report-block";
import { StructuredOutreachReport } from "./structured-outreach-report";

export function MessageListView({
  className,
  onFeedback,
  onSendMessage,
}: {
  className?: string;
  onFeedback?: (feedback: { option: Option }) => void;
  onSendMessage?: (
    message: string,
    options?: { interruptFeedback?: string },
  ) => void;
}) {
  const scrollContainerRef = useRef<ScrollContainerRef>(null);
  const messageIds = useMessageIds();
  const interruptMessage = useLastInterruptMessage();
  const waitingForFeedbackMessageId = useLastFeedbackMessageId();
  const responding = useStore((state) => state.responding);
  const noOngoingResearch = useStore(
    (state) => state.ongoingResearchId === null,
  );
  const ongoingResearchIsOpen = useStore(
    (state) => state.ongoingResearchId === state.openResearchId,
  );

  const handleToggleResearch = useCallback(() => {
    // Fix the issue where auto-scrolling to the bottom
    // occasionally fails when toggling research.
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollToBottom();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ScrollContainer
      className={cn("flex h-full w-full flex-col overflow-hidden", className)}
      scrollShadowColor="var(--app-background)"
      autoScrollToBottom
      ref={scrollContainerRef}
    >
      <ul className="flex flex-col">
        {messageIds.map((messageId) => (
          <MessageListItem
            key={messageId}
            messageId={messageId}
            waitForFeedback={waitingForFeedbackMessageId === messageId}
            interruptMessage={interruptMessage}
            onFeedback={onFeedback}
            onSendMessage={onSendMessage}
            onToggleResearch={handleToggleResearch}
          />
        ))}
        <div className="flex h-8 w-full shrink-0"></div>
      </ul>
      {responding && (noOngoingResearch || !ongoingResearchIsOpen) && (
        <LoadingAnimation className="ml-4" />
      )}
    </ScrollContainer>
  );
}

function MessageListItem({
  className,
  messageId,
  waitForFeedback,
  interruptMessage,
  onFeedback,
  onSendMessage,
  onToggleResearch,
}: {
  className?: string;
  messageId: string;
  waitForFeedback?: boolean;
  onFeedback?: (feedback: { option: Option }) => void;
  interruptMessage?: Message | null;
  onSendMessage?: (
    message: string,
    options?: { interruptFeedback?: string },
  ) => void;
  onToggleResearch?: () => void;
}) {
  const message = useMessage(messageId);
  const researchIds = useStore((state) => state.researchIds);
  const startOfResearch = useMemo(() => {
    return researchIds.includes(messageId);
  }, [researchIds, messageId]);
  if (message) {
    if (
      message.role === "user" ||
      message.agent === "coordinator" ||
      message.agent === "planner" ||
      message.agent === "reporter" ||
      message.agent === "podcast" ||
      startOfResearch
    ) {
      let content: React.ReactNode;
      if (message.agent === "planner") {
        content = (
          <div className="w-full px-4">
            <PlanCard
              message={message}
              waitForFeedback={waitForFeedback}
              interruptMessage={interruptMessage}
              onFeedback={onFeedback}
              onSendMessage={onSendMessage}
            />
          </div>
        );
      } else if (message.agent === "reporter") {
        content = (
          <div className="w-full px-4">
            <ReportCard message={message} />
          </div>
        );
      } else if (message.agent === "podcast") {
        content = (
          <div className="w-full px-4">
            <PodcastCard message={message} />
          </div>
        );
      } else if (startOfResearch) {
        content = (
          <div className="w-full px-4">
            <ResearchCard
              researchId={message.id}
              onToggleResearch={onToggleResearch}
            />
          </div>
        );
      } else {
        content = message.content ? (
          <div
            className={cn(
              "flex w-full px-4",
              message.role === "user" && "justify-end",
              className,
            )}
          >
            <MessageBubble message={message}>
              <div className="flex w-full flex-col text-wrap break-words">
                <Markdown
                  className={cn(
                    message.role === "user" &&
                      "prose-invert not-dark:text-secondary dark:text-inherit",
                  )}
                >
                  {message?.content}
                </Markdown>
              </div>
            </MessageBubble>
          </div>
        ) : null;
      }
      if (content) {
        return (
          <motion.li
            className="mt-10"
            key={messageId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ transition: "all 0.2s ease-out" }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            {content}
          </motion.li>
        );
      }
    }
    return null;
  }
}

function MessageBubble({
  className,
  message,
  children,
}: {
  className?: string;
  message: Message;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        `group flex w-fit max-w-[85%] flex-col rounded-2xl px-4 py-3 shadow`,
        message.role === "user" && "bg-brand rounded-ee-none",
        message.role === "assistant" && "bg-card rounded-es-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ResearchCard({
  className,
  researchId,
  onToggleResearch,
}: {
  className?: string;
  researchId: string;
  onToggleResearch?: () => void;
}) {
  const reportId = useStore((state) => state.researchReportIds.get(researchId));
  const hasReport = reportId !== undefined;
  const reportGenerating = useStore(
    (state) => hasReport && state.messages.get(reportId)!.isStreaming,
  );
  const openResearchId = useStore((state) => state.openResearchId);
  const state = useMemo(() => {
    if (hasReport) {
      return reportGenerating ? "Generating report..." : "Report generated";
    }
    return "Researching...";
  }, [hasReport, reportGenerating]);
  const msg = useResearchMessage(researchId);
  const title = useMemo(() => {
    if (msg) {
      const titleMatch = /#\s+(.+)$/m.exec(msg.content ?? "");
      if (titleMatch?.[1]) {
        return titleMatch[1].trim();
      }
    }
    return undefined;
  }, [msg]);
  const handleOpen = useCallback(() => {
    if (openResearchId === researchId) {
      closeResearch();
    } else {
      openResearch(researchId);
    }
    onToggleResearch?.();
  }, [openResearchId, researchId, onToggleResearch]);
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>
          <RainbowText animated={state !== "Report generated"}>
            {title !== undefined && title !== "" ? title : "Deep Research"}
          </RainbowText>
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <div className="flex w-full">
          <RollingText className="text-muted-foreground flex-grow text-sm">
            {state}
          </RollingText>
          <Button
            variant={!openResearchId ? "default" : "outline"}
            onClick={handleOpen}
          >
            {researchId !== openResearchId ? "Open" : "Close"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function ReportCard({
  className,
  message,
}: {
  className?: string;
  message: Message;
}) {
  const { title, summary, profile, strategy, outreach, next_steps, sources } =
    useMemo(() => {
      const content = message.content || "";
      
      // Try to parse sections using different patterns
      const parseSection = (sectionName: string, content: string): string => {
        const patterns = [
          new RegExp(`## ${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'),
          new RegExp(`# ${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n# |$)`, 'i'),
          new RegExp(`\\*\\*${sectionName}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`, 'i'),
        ];
        
        for (const pattern of patterns) {
          const match = content.match(pattern);
          if (match?.[1]) {
            return match[1].trim();
          }
        }
        return "";
      };

      // Extract title - try different patterns
      let title = "";
      const titleMatch = /#\s+(.+)$/m.exec(content);
      if (titleMatch?.[1]) {
        title = titleMatch[1].trim();
      }

      return {
        title: title || "Outreach Report",
        summary: parseSection("Outreach Summary", content),
        profile: parseSection("Recipient Profile", content),
        strategy: parseSection("Outreach Strategy", content),
        outreach: parseSection("Outreach Message", content),
        next_steps: parseSection("Next Steps", content),
        sources: parseSection("Sources", content),
      };
    }, [message.content]);

  // If we can't parse structured content, show the raw content
  if (!summary && !profile && !strategy && !outreach) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Final Report
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <Markdown className="prose prose-sm max-w-none dark:prose-invert">
            {message.content}
          </Markdown>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="outreach">Message</TabsTrigger>
            <TabsTrigger value="next_steps">Next Steps</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 max-h-80 overflow-y-auto">
            <TabsContent value="summary" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Key Findings</h4>
                <Markdown className="prose prose-sm max-w-none dark:prose-invert">
                  {summary || "No summary available"}
                </Markdown>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Target Profile</h4>
                <Markdown className="prose prose-sm max-w-none dark:prose-invert">
                  {profile || "No profile information available"}
                </Markdown>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Recommended Approach</h4>
                <Markdown className="prose prose-sm max-w-none dark:prose-invert">
                  {strategy || "No strategy information available"}
                </Markdown>
              </div>
            </TabsContent>
            
            <TabsContent value="outreach" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Crafted Message</h4>
                <div className="rounded-md border bg-muted/50 p-4">
                  <Markdown className="prose prose-sm max-w-none dark:prose-invert">
                    {outreach || "No outreach message available"}
                  </Markdown>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="next_steps" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Follow-up Actions</h4>
                <Markdown className="prose prose-sm max-w-none dark:prose-invert">
                  {next_steps || "No next steps available"}
                </Markdown>
              </div>
            </TabsContent>
            
            <TabsContent value="sources" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Research Sources</h4>
                <Markdown className="prose prose-sm max-w-none dark:prose-invert">
                  {sources || "No sources listed"}
                </Markdown>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ThoughtBlock({
  className,
  content,
  isStreaming,
  hasMainContent,
}: {
  className?: string;
  content: string;
  isStreaming?: boolean;
  hasMainContent?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

  React.useEffect(() => {
    if (hasMainContent && !hasAutoCollapsed) {
      setIsOpen(false);
      setHasAutoCollapsed(true);
    }
  }, [hasMainContent, hasAutoCollapsed]);

  if (!content || content.trim() === "") {
    return null;
  }

  return (
    <div className={cn("mb-6 w-full", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-auto w-full justify-start rounded-xl border px-6 py-4 text-left transition-all duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              isStreaming
                ? "border-primary/20 bg-primary/5 shadow-sm"
                : "border-border bg-card",
            )}
          >
            <div className="flex w-full items-center gap-3">
              <Lightbulb
                size={18}
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  isStreaming ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "leading-none font-semibold transition-colors duration-200",
                  isStreaming ? "text-primary" : "text-foreground",
                )}
              >
                Deep Thinking
              </span>
              {isStreaming && <LoadingAnimation className="ml-2 scale-75" />}
              <div className="flex-grow" />
              {isOpen ? (
                <ChevronDown
                  size={16}
                  className="text-muted-foreground transition-transform duration-200"
                />
              ) : (
                <ChevronRight
                  size={16}
                  className="text-muted-foreground transition-transform duration-200"
                />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2 mt-3">
          <Card
            className={cn(
              "transition-all duration-200",
              isStreaming ? "border-primary/20 bg-primary/5" : "border-border",
            )}
          >
            <CardContent>
              <div className="flex h-40 w-full overflow-y-auto">
                <ScrollContainer
                  className={cn(
                    "flex h-full w-full flex-col overflow-hidden",
                    className,
                  )}
                  scrollShadow={false}
                  autoScrollToBottom
                >
                  <Markdown
                    className={cn(
                      "prose dark:prose-invert max-w-none transition-colors duration-200",
                      isStreaming ? "prose-primary" : "opacity-80",
                    )}
                    animated={isStreaming}
                  >
                    {content}
                  </Markdown>
                </ScrollContainer>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const GREETINGS = ["Cool", "Sounds great", "Looks good", "Great", "Awesome"];
function PlanCard({
  className,
  message,
  interruptMessage,
  onFeedback,
  waitForFeedback,
  onSendMessage,
}: {
  className?: string;
  message: Message;
  interruptMessage?: Message | null;
  onFeedback?: (feedback: { option: Option }) => void;
  onSendMessage?: (
    message: string,
    options?: { interruptFeedback?: string },
  ) => void;
  waitForFeedback?: boolean;
}) {
  const plan = useMemo<{
    title?: string;
    thought?: string;
    steps?: { title?: string; description?: string }[];
  }>(() => {
    return parseJSON(message.content ?? "", {});
  }, [message.content]);

  const title = useMemo(() => {
    if (plan.title) {
      return plan.title;
    }
    if (message.isStreaming) {
      return "Generating Outreach Plan...";
    }
    return "Outreach Plan";
  }, [plan.title, message.isStreaming]);

  const reasoningContent = message.reasoningContent;
  const hasMainContent = Boolean(
    message.content && message.content.trim() !== "",
  );

  // 判断是否正在思考：有推理内容但还没有主要内容
  const isThinking = Boolean(reasoningContent && !hasMainContent);

  // 判断是否应该显示计划：有主要内容就显示（无论是否还在流式传输）
  const shouldShowPlan = hasMainContent;
  const handleAccept = useCallback(async () => {
    if (onSendMessage) {
      onSendMessage(
        `${GREETINGS[Math.floor(Math.random() * GREETINGS.length)]}! ${Math.random() > 0.5 ? "Let's get started." : "Let's start."}`,
        {
          interruptFeedback: "accepted",
        },
      );
    }
  }, [onSendMessage]);
  return (
    <div className={cn("w-full", className)}>
      {reasoningContent && (
        <ThoughtBlock
          content={reasoningContent}
          isStreaming={isThinking}
          hasMainContent={hasMainContent}
        />
      )}
      {shouldShowPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                <Markdown animated={message.isStreaming}>
                  {`### ${title}`}
                </Markdown>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown className="opacity-80" animated={message.isStreaming}>
                {plan.thought}
              </Markdown>
              {plan.steps && (
                <ul className="my-2 flex list-decimal flex-col gap-4 border-l-[2px] pl-8">
                  {plan.steps.map((step, i) => (
                    <li key={`step-${i}`}>
                      <h3 className="mb text-lg font-medium">
                        <Markdown animated={message.isStreaming}>
                          {step.title}
                        </Markdown>
                      </h3>
                      <div className="text-muted-foreground text-sm">
                        <Markdown animated={message.isStreaming}>
                          {step.description}
                        </Markdown>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {!message.isStreaming && interruptMessage?.options?.length && (
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {interruptMessage?.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        option.value === "accepted" ? "default" : "outline"
                      }
                      disabled={!waitForFeedback}
                      onClick={() => {
                        if (option.value === "accepted") {
                          void handleAccept();
                        } else {
                          onFeedback?.({
                            option,
                          });
                        }
                      }}
                    >
                      {option.value === "accepted" ? "Start drafting" : option.text}
                    </Button>
                  ))}
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function PodcastCard({
  className,
  message,
}: {
  className?: string;
  message: Message;
}) {
  const data = useMemo(() => {
    return JSON.parse(message.content ?? "");
  }, [message.content]);
  const title = useMemo<string | undefined>(() => data?.title, [data]);
  const audioUrl = useMemo<string | undefined>(() => data?.audioUrl, [data]);
  const isGenerating = useMemo(() => {
    return message.isStreaming;
  }, [message.isStreaming]);
  const hasError = useMemo(() => {
    return data?.error !== undefined;
  }, [data]);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <Card className={cn("w-[508px]", className)}>
      <CardHeader>
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {isGenerating ? <LoadingOutlined /> : <Headphones size={16} />}
            {!hasError ? (
              <RainbowText animated={isGenerating}>
                {isGenerating
                  ? "Generating podcast..."
                  : isPlaying
                    ? "Now playing podcast..."
                    : "Podcast"}
              </RainbowText>
            ) : (
              <div className="text-red-500">
                Error when generating podcast. Please try again.
              </div>
            )}
          </div>
          {!hasError && !isGenerating && (
            <div className="flex">
              <Tooltip title="Download podcast">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={audioUrl}
                    download={`${(title ?? "podcast").replaceAll(" ", "-")}.mp3`}
                  >
                    <Download size={16} />
                  </a>
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
        <CardTitle>
          <div className="text-lg font-medium">
            <RainbowText animated={isGenerating}>{title}</RainbowText>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {audioUrl ? (
          <audio
            className="w-full"
            src={audioUrl}
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full"></div>
        )}
      </CardContent>
    </Card>
  );
}
