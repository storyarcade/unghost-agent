import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface GlassmorphicCardProps {
  variant?: "default" | "elevated" | "interactive" | "ai-enhanced";
  glow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function GlassmorphicCard({
  className,
  variant = "default",
  glow = false,
  children
}: GlassmorphicCardProps) {
  const variants = {
    default: "glassmorphic",
    elevated: "glassmorphic shadow-2xl hover:shadow-3xl",
    interactive: "glassmorphic hover:scale-[1.02] transition-transform",
    "ai-enhanced": "glassmorphic ai-content-card",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-2xl p-6",
        variants[variant],
        glow && "ai-gradient-border",
        className
      )}
    >
      {children}
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-xl -z-10" />
      )}
    </motion.div>
  );
}

export function GlassmorphicSection({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "bg-gradient-to-br from-background/80 via-background/60 to-background/80",
        "backdrop-blur-xl border border-border/30",
        "shadow-2xl",
        className
      )}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-shift" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />
    </section>
  );
}

export function FloatingCard({
  className,
  children,
  delay = 0,
  ...props
}: React.ComponentProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "relative rounded-2xl p-6",
        "bg-gradient-to-br from-card/90 via-card/80 to-card/90",
        "backdrop-blur-md border border-border/40",
        "shadow-xl hover:shadow-2xl",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Enhanced feature card with glassmorphism
export function FeatureCard({
  title,
  description,
  icon,
  className,
  ...props
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <FloatingCard
      className={cn(
        "group cursor-pointer",
        "hover:border-primary/30",
        className
      )}
    >
      {icon && (
        <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </FloatingCard>
  );
}