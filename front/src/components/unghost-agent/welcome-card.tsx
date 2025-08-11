import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import React from "react";

interface WelcomeCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export function WelcomeCard({ className, title, description, children }: WelcomeCardProps) {
  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-3xl glassmorphic p-8 md:p-12",
        "bg-gradient-to-br from-card/90 via-card/70 to-card/90",
        "shadow-2xl border border-border/30",
        "overflow-hidden",
        className
      )}
      style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-gradient-shift" />
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="relative z-10">
        {title && (
          <motion.h3 
            className="mb-4 text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
        )}
        {description && (
          <motion.div 
            className="text-muted-foreground px-4 text-center text-lg leading-relaxed mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.div>
        )}
        {children}
      </div>
    </motion.div>
  );
}