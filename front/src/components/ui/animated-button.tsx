import { motion, type HTMLMotionProps } from "framer-motion";
import * as React from "react";

import { Button, buttonVariants } from "./button";
import { cn } from "~/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "className">,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  ripple?: boolean;
}

export function AnimatedButton({
  children,
  className,
  variant,
  size,
  ripple = true,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = React.useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { x, y, id }]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      onClick?.(e as any);
    },
    [onClick, ripple]
  );

  return (
    <motion.button
      className={cn(
        buttonVariants({ variant, size }),
        "btn-microinteraction relative",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripple && ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
}

// Floating Action Button with enhanced animations
export function FloatingActionButton({
  children,
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <AnimatedButton
        className={cn(
          "rounded-full shadow-2xl hover:shadow-3xl",
          "bg-gradient-to-br from-primary to-primary/80",
          className
        )}
        size="icon-lg"
        whileHover={{
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
        }}
        {...props}
      >
        {children}
      </AnimatedButton>
    </motion.div>
  );
}

// Pulse Animation Button
export function PulseButton({
  children,
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <div className="relative inline-flex">
      <motion.div
        className="absolute inset-0 rounded-lg bg-primary/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <AnimatedButton className={className} {...props}>
        {children}
      </AnimatedButton>
    </div>
  );
}