// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { useCallback, useRef } from "react";

import ReportEditor from "~/components/editor";
import { LoadingAnimation } from "~/components/unghost-agent/loading-animation";
import { Markdown } from "~/components/unghost-agent/markdown";
import { useReplay } from "~/core/replay";
import { useMessage, useStore } from "~/core/store";
import { cn } from "~/lib/utils";

import { StructuredOutreachReport } from "./structured-outreach-report";

export function ResearchReportBlock({
  className,
  messageId,
  editing,
}: {
  className?: string;
  researchId: string;
  messageId: string;
  editing: boolean;
}) {
  const message = useMessage(messageId);
  const { isReplay } = useReplay();
  const handleMarkdownChange = useCallback(
    (markdown: string) => {
      if (message) {
        message.content = markdown;
        useStore.setState({
          messages: new Map(useStore.getState().messages).set(
            message.id,
            message,
          ),
        });
      }
    },
    [message],
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const isCompleted = message?.isStreaming === false && message?.content !== "";
  
  // Check if this is an outreach report based on content structure
  const isOutreachReport = message?.content && (
    message.content.includes('Outreach Message') || 
    message.content.includes('Recipient Profile') ||
    message.content.includes('Outreach Strategy')
  );
  // TODO: scroll to top when completed, but it's not working
  // useEffect(() => {
  //   if (isCompleted && contentRef.current) {
  //     setTimeout(() => {
  //       contentRef
  //         .current!.closest("[data-radix-scroll-area-viewport]")
  //         ?.scrollTo({
  //           top: 0,
  //           behavior: "smooth",
  //         });
  //     }, 500);
  //   }
  // }, [isCompleted]);

  return (
    <div ref={contentRef} className={cn("w-full pt-4 pb-8", className)}>
      {!isReplay && isCompleted && editing ? (
        <ReportEditor
          content={message?.content}
          onMarkdownChange={handleMarkdownChange}
        />
      ) : isOutreachReport && message?.content ? (
        <>
          <StructuredOutreachReport content={message.content} />
          {message?.isStreaming && <LoadingAnimation className="my-12" />}
        </>
      ) : (
        <>
          <Markdown animated checkLinkCredibility>
            {message?.content}
          </Markdown>
          {message?.isStreaming && <LoadingAnimation className="my-12" />}
        </>
      )}
    </div>
  );
}
