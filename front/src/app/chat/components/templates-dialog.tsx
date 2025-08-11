import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Code, 
  DollarSign, 
  GraduationCap, 
  Handshake, 
  Heart, 
  Lightbulb, 
  Mail, 
  Search,
  Sparkles,
  Target,
  Users,
  X
} from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { GlassmorphicCard } from "~/components/ui/glassmorphic-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  tags: string[];
  color: string;
  tone: string;
  use_case: string;
}

const templates: Template[] = [
  {
    id: "vc-pitch",
    category: "Fundraising",
    title: "VC Pitch Outreach",
    description: "Get VCs to review your pitch deck and book a meeting",
    prompt: "Help me craft a compelling outreach message to [VC Name] at [VC Firm] about my [Industry] startup that [Core Value Proposition]. I want them to review my pitch deck and schedule a meeting.",
    icon: <DollarSign className="h-5 w-5" />,
    tags: ["Fundraising", "Pitch Deck", "Series A/B"],
    color: "from-green-500/20 to-emerald-500/20",
    tone: "Confident",
    use_case: "Fundraising"
  },
  {
    id: "sales-enterprise",
    category: "Sales",
    title: "Enterprise Sales",
    description: "Convert cold enterprise prospects into qualified meetings",
    prompt: "Create a personalized outreach sequence for [Decision Maker Title] at [Company Name] showing how our [Product/Solution] can solve their [Specific Pain Point] and achieve [Desired Outcome].",
    icon: <Briefcase className="h-5 w-5" />,
    tags: ["B2B Sales", "Enterprise", "Cold Outreach"],
    color: "from-blue-500/20 to-cyan-500/20",
    tone: "Professional",
    use_case: "Sales"
  },
  {
    id: "recruiting-tech",
    category: "Recruiting",
    title: "Tech Talent Acquisition",
    description: "Attract top engineers and developers to your team",
    prompt: "Write an engaging message to recruit a [Role Title] with expertise in [Technologies] for our [Company Type] working on [Project/Product]. Highlight [Key Benefits/Culture].",
    icon: <Code className="h-5 w-5" />,
    tags: ["Recruiting", "Tech", "Hiring"],
    color: "from-purple-500/20 to-pink-500/20",
    tone: "Enthusiastic",
    use_case: "Recruiting"
  },
  {
    id: "partnership-saas",
    category: "Partnerships",
    title: "SaaS Partnership",
    description: "Propose strategic partnerships with complementary SaaS companies",
    prompt: "Draft a partnership proposal to [Company Name] suggesting how our [Your Product] can integrate with their [Their Product] to provide [Mutual Benefit] for our shared customer base in [Industry].",
    icon: <Handshake className="h-5 w-5" />,
    tags: ["Partnerships", "Integration", "B2B"],
    color: "from-indigo-500/20 to-purple-500/20",
    tone: "Collaborative",
    use_case: "Partnerships"
  },
  {
    id: "linkedin-thought-leader",
    category: "Networking",
    title: "LinkedIn Thought Leader",
    description: "Connect with industry thought leaders and influencers",
    prompt: "Compose a LinkedIn connection request to [Influencer Name], referencing their recent post/article about [Topic] and explaining how my work in [Your Area] aligns with their insights.",
    icon: <Lightbulb className="h-5 w-5" />,
    tags: ["LinkedIn", "Networking", "Thought Leadership"],
    color: "from-amber-500/20 to-orange-500/20",
    tone: "Thoughtful",
    use_case: "Networking"
  },
  {
    id: "customer-success",
    category: "Customer Success",
    title: "Customer Re-engagement",
    description: "Win back churned customers or upsell existing ones",
    prompt: "Create a re-engagement campaign for [Customer Name] who churned [Time Period] ago due to [Reason], highlighting our new features [New Features] that address their original concerns.",
    icon: <Heart className="h-5 w-5" />,
    tags: ["Customer Success", "Retention", "Upsell"],
    color: "from-red-500/20 to-pink-500/20",
    tone: "Caring",
    use_case: "Customer Success"
  },
  {
    id: "investor-update",
    category: "Investor Relations",
    title: "Investor Follow-up",
    description: "Keep investors engaged with compelling updates",
    prompt: "Write a follow-up message to [Investor Name] who showed interest in our [Funding Round], updating them on our recent achievements: [Metrics/Milestones] and next steps.",
    icon: <Target className="h-5 w-5" />,
    tags: ["Investors", "Updates", "Fundraising"],
    color: "from-violet-500/20 to-purple-500/20",
    tone: "Confident",
    use_case: "Investor Relations"
  },
  {
    id: "conference-speaker",
    category: "Speaking",
    title: "Conference Speaking",
    description: "Pitch yourself as a speaker at industry conferences",
    prompt: "Craft a speaker proposal to [Conference Name] organizers, positioning myself as an expert in [Topic] with unique insights from [Your Experience] that would benefit their [Target Audience].",
    icon: <GraduationCap className="h-5 w-5" />,
    tags: ["Speaking", "Conference", "Thought Leadership"],
    color: "from-teal-500/20 to-cyan-500/20",
    tone: "Expert",
    use_case: "Speaking"
  }
];

const categories = [...new Set(templates.map(t => t.category))];

export function TemplatesDialog({ onSelectTemplate }: { onSelectTemplate: (template: { id: string; title: string; tone: string; use_case: string; prompt: string } | null) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = selectedCategory 
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate({
      id: template.id,
      title: template.title,
      tone: template.tone,
      use_case: template.use_case,
      prompt: template.prompt
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="btn-microinteraction gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden glassmorphic">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Outreach Templates
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Choose a template preference - our AI will intelligently select and adapt the best template based on your research
          </p>
        </DialogHeader>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="shrink-0"
            >
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <ScrollArea className="h-[500px] px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <GlassmorphicCard
                      variant="interactive"
                      glow={hoveredTemplate === template.id}
                      className={cn(
                        "cursor-pointer p-4 h-full",
                        "hover:border-primary/30 transition-all duration-300",
                        "group"
                      )}
                    >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        "bg-gradient-to-br",
                        template.color,
                        "group-hover:scale-110 transition-transform"
                      )}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {template.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Custom Template Option */}
        <div className="p-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Can't find what you need? Start with a blank template</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSelectTemplate(null);
                setIsOpen(false);
              }}
            >
              Start from scratch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}