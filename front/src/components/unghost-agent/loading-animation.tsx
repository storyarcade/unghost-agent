// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

type LoadingAnimationProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dots" | "pulse" | "bars" | "ghost";
  color?: "primary" | "muted" | "accent";
};

const sizeVariants = {
  sm: {
    container: "h-4",
    dot: "w-1 h-1",
    bar: "w-1 h-3",
    spacing: "gap-1",
  },
  md: {
    container: "h-6",
    dot: "w-1.5 h-1.5",
    bar: "w-1.5 h-4",
    spacing: "gap-1.5",
  },
  lg: {
    container: "h-8",
    dot: "w-2 h-2",
    bar: "w-2 h-6",
    spacing: "gap-2",
  },
};

const colorVariants = {
  primary: "bg-primary",
  muted: "bg-muted-foreground",
  accent: "bg-accent-foreground",
};

export function LoadingAnimation({
  className,
  size = "md",
  variant = "dots",
  color = "primary",
}: LoadingAnimationProps) {
  const sizeConfig = sizeVariants[size];
  const colorClass = colorVariants[color];

  const containerClass = cn(
    "flex items-center justify-center",
    sizeConfig.container,
    sizeConfig.spacing,
    className
  );

  const bounceTransition = {
    duration: 0.6,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  };

  const pulseTransition = {
    duration: 1.5,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  };

  if (variant === "pulse") {
    return (
      <div className={containerClass}>
        <motion.div
          className={cn(
            "rounded-full",
            sizeConfig.dot,
            colorClass
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut" as const,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={containerClass}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "rounded-sm",
              sizeConfig.bar,
              colorClass
            )}
            animate={{
              scaleY: [1, 2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              ...bounceTransition,
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "ghost") {
    return (
      <div className={containerClass}>
        <motion.div
          className="relative"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            ease: "linear" as const,
            repeat: Infinity,
          }}
        >
          <div className="text-2xl">👻</div>
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/30"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 3,
              ease: "linear" as const,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
    );
  }

  // Default dots variant with enhanced animations
  return (
    <div className={containerClass}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn(
            "rounded-full",
            sizeConfig.dot,
            colorClass
          )}
          animate={{
            y: [-2, -8, -2],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            ...bounceTransition,
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}
