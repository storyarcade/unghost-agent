import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Download, 
  Expand, 
  Mail, 
  Minimize, 
  RefreshCw,
  Send,
  Sparkles,
  X 
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "~/components/ui/button";
import { GlassmorphicCard } from "~/components/ui/glassmorphic-card";
import { Tooltip } from "~/components/unghost-agent/tooltip";
import { cn } from "~/lib/utils";

interface LivePreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  recipientName?: string;
  recipientTitle?: string;
  isGenerating?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function LivePreviewPanel({
  isOpen,
  onClose,
  content,
  recipientName = "Recipient",
  recipientTitle = "Title at Company",
  isGenerating = false,
  onRefresh,
  className
}: LivePreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  useEffect(() => {
    // Parse the content to extract the actual message
    const lines = content.split('\n');
    const messageStart = lines.findIndex(line => 
      line.toLowerCase().includes('subject:') || 
      line.toLowerCase().includes('message:') ||
      line.toLowerCase().includes('outreach message')
    );
    
    if (messageStart !== -1) {
      setEmailContent(lines.slice(messageStart).join('\n'));
    } else {
      setEmailContent(content);
    }
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExport = () => {
    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach-message-${recipientName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    const subject = emailContent.match(/Subject: (.+)/i)?.[1] || "Outreach Message";
    const body = emailContent.replace(/Subject: .+\n/i, '');
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed right-4 top-20 bottom-4 z-50",
            isExpanded ? "left-4 md:left-1/3" : "w-96 max-w-[calc(100vw-2rem)]",
            className
          )}
        >
          <GlassmorphicCard
            variant="elevated"
            glow
            className="h-full flex flex-col p-0 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Live Preview</h3>
                  <span className="ai-badge text-xs">Real-time</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip title={isExpanded ? "Minimize" : "Expand"}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="h-8 w-8"
                    >
                      {isExpanded ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Close">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Email Preview */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {/* Recipient Info */}
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{recipientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="text-muted-foreground">{recipientTitle}</span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          <span className="text-sm">Generating preview...</span>
                        </div>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 bg-muted/50 rounded animate-pulse" />
                            <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          {emailContent || "Start typing to see a live preview of your outreach message..."}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Gradient overlay at bottom for long content */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {onRefresh && (
                    <Tooltip title="Regenerate">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isGenerating}
                        className="gap-2"
                      >
                        <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                        <span className="hidden sm:inline">Refresh</span>
                      </Button>
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip title="Export as text">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleExport}
                      disabled={!emailContent || isGenerating}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      disabled={!emailContent || isGenerating}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Open in email client">
                    <Button
                      variant="agentic"
                      size="sm"
                      onClick={handleSendEmail}
                      disabled={!emailContent || isGenerating}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}