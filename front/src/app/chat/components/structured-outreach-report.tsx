// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { ChevronDown, ChevronRight, Copy, Mail, User, Target, ArrowRight, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Markdown } from "~/components/unghost-agent/markdown";
import { Tooltip } from "~/components/unghost-agent/tooltip";
import { cn } from "~/lib/utils";

interface ReportSection {
  title: string;
  content: string;
}

export function StructuredOutreachReport({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    summary: true,
    profile: false,
    strategy: false,
    nextSteps: false,
    sources: false,
  });

  const sections = useMemo(() => {
    return parseMarkdownSections(content);
  }, [content]);

  const handleCopyMessage = async () => {
    const messageSection = sections.find(s => 
      s.title.toLowerCase().includes('outreach message') || 
      s.title.toLowerCase().includes('message')
    );
    
    if (messageSection) {
      try {
        // Extract just the message content, removing any formatting
        const messageText = messageSection.content
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/^\s*[\*\-\+]\s+/gm, '') // Remove list markers
          .replace(/^#+\s+/gm, '') // Remove headers
          .trim();
        
        await navigator.clipboard.writeText(messageText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy message:', error);
      }
    }
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const reportTitle = sections.find(s => s.title === 'title')?.content ?? 'Outreach Report';
  const outreachSummary = sections.find(s => s.title.toLowerCase().includes('summary'));
  const recipientProfile = sections.find(s => s.title.toLowerCase().includes('profile'));
  const outreachStrategy = sections.find(s => s.title.toLowerCase().includes('strategy'));
  const outreachMessage = sections.find(s => 
    s.title.toLowerCase().includes('outreach message') || 
    s.title.toLowerCase().includes('message')
  );
  const nextSteps = sections.find(s => s.title.toLowerCase().includes('next steps'));
  const sources = sections.find(s => s.title.toLowerCase().includes('sources'));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Report Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          <Markdown>{reportTitle}</Markdown>
        </h1>
      </div>

      {/* Prominent Outreach Message */}
      {outreachMessage && (
        <Card className="ai-gradient-border ai-message-enhanced">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Outreach Message
                <span className="ai-badge">AI Generated</span>
              </div>
              <Tooltip title={copied ? "Copied!" : "Copy message"}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMessage}
                  className="text-xs btn-microinteraction"
                >
                  {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg glassmorphic p-4">
              <Markdown>{outreachMessage.content}</Markdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Outreach Summary */}
        {outreachSummary && (
          <Collapsible
            open={openSections.summary}
            onOpenChange={() => toggleSection('summary')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Key Insights</span>
                </div>
                {openSections.summary ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="ai-content-card">
                <CardContent className="pt-4">
                  <Markdown>{outreachSummary.content}</Markdown>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Recipient Profile */}
        {recipientProfile && (
          <Collapsible
            open={openSections.profile}
            onOpenChange={() => toggleSection('profile')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Recipient Profile</span>
                </div>
                {openSections.profile ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-4">
                  <Markdown>{recipientProfile.content}</Markdown>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Outreach Strategy */}
        {outreachStrategy && (
          <Collapsible
            open={openSections.strategy}
            onOpenChange={() => toggleSection('strategy')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">Outreach Strategy</span>
                </div>
                {openSections.strategy ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-4">
                  <Markdown>{outreachStrategy.content}</Markdown>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Next Steps */}
        {nextSteps && (
          <Collapsible
            open={openSections.nextSteps}
            onOpenChange={() => toggleSection('nextSteps')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold">Next Steps</span>
                </div>
                {openSections.nextSteps ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-4">
                  <Markdown>{nextSteps.content}</Markdown>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Sources */}
        {sources && (
          <Collapsible
            open={openSections.sources}
            onOpenChange={() => toggleSection('sources')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold">Sources</span>
                </div>
                {openSections.sources ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-4">
                  <Markdown>{sources.content}</Markdown>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

function parseMarkdownSections(content: string): ReportSection[] {
  const sections: ReportSection[] = [];
  const lines = content.split('\n');
  
  let currentSection: ReportSection | null = null;
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Check if this is a header line
    const headerRegex = /^#+\s+(.+)$/;
    const headerMatch = headerRegex.exec(line);
    
    if (headerMatch) {
      // Save the previous section if it exists
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      
      // Start a new section
      const title = headerMatch[1]?.trim() ?? '';
      currentSection = {
        title: title,
        content: ''
      };
      currentContent = [];
    } else if (currentSection) {
      // Add content to the current section
      currentContent.push(line);
    } else if (line.trim() && !currentSection) {
      // This might be a title without header formatting
      if (sections.length === 0) {
        sections.push({
          title: 'title',
          content: line.trim()
        });
      }
    }
  }
  
  // Don't forget the last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }
  
  return sections;
} 