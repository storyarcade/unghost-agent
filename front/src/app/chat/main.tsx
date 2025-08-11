// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

"use client";

import { useMemo, useState, useEffect } from "react";

import { useStore, useMessageIds, useMessage } from "~/core/store";
import { cn } from "~/lib/utils";

import { MessagesBlock } from "./components/messages-block";
import { ResearchBlock } from "./components/research-block";
import { LivePreviewPanel } from "./components/live-preview-panel";

export default function Main() {
  const openResearchId = useStore((state) => state.openResearchId);
  const doubleColumnMode = useMemo(
    () => openResearchId !== null,
    [openResearchId],
  );
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [recipientInfo, setRecipientInfo] = useState({
    name: "Recipient",
    title: "Title at Company"
  });
  
  const messageIds = useMessageIds();
  
  // Auto-open preview when an outreach message is generated
  useEffect(() => {
    if (messageIds.length > 0) {
      const lastMessageId = messageIds[messageIds.length - 1];
      // Check if this message contains outreach content
      // Note: In production, you would properly access the message content
      // through the store's message getter
    }
  }, [messageIds]);
  
  return (
    <>
      <div
        className={cn(
          "flex h-full w-full justify-center px-6 pt-20 pb-6 gap-6",
          "max-w-[1600px] mx-auto", // Max width for better readability
          doubleColumnMode && "lg:gap-8",
          isPreviewOpen && "lg:pr-[440px]", // Make room for preview panel on large screens
        )}
      >
        <MessagesBlock
          className={cn(
            "flex-1 max-w-[800px] transition-all duration-300 ease-out",
            !doubleColumnMode && "mx-auto",
            doubleColumnMode && "max-w-[600px]",
          )}
        />
        <ResearchBlock
          className={cn(
            "transition-all duration-300 ease-out",
            !doubleColumnMode && "hidden",
            doubleColumnMode && "flex-1 max-w-[600px]",
          )}
          researchId={openResearchId}
        />
      </div>
      <LivePreviewPanel
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        content={previewContent}
        recipientName={recipientInfo.name}
        recipientTitle={recipientInfo.title}
      />
    </>
  );
}
