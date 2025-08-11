// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Github,
  MessageCircle,
  Target,
  Users,
  Zap,
  Sparkles,
  Ghost,
  Search,
  Brain,
  TrendingUp,
  Twitter,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuroraText } from "~/components/magicui/aurora-text";
import { Button } from "~/components/ui/button";
import { WelcomeCard } from "~/components/unghost-agent/welcome-card";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import React from "react";

export function Jumbotron() {
  const [isHoveringPrimary, setIsHoveringPrimary] = useState(false);
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const inspirationSlides = [
    {
      id: 1,
      image: "/images/x1.png",
      title: "Khetan's Inspiration",
      description: "The spark that ignited AI-powered personalized outreach",
      link: "https://x.com/bhavye_khetan/status/1929379775602373012",
      author: "@bhavye_khetan",
      color: "indigo",
      type: "inspiration"
    },
    {
      id: 2,
      image: "/images/x2.png",
      title: "Roy Lee's Bold Approach",
      description: "Revolutionary AI assistance that breaks all boundaries",
      link: "https://x.com/im_roy_lee/status/1936138361011585190",
      author: "@im_roy_lee",
      color: "purple",
      type: "inspiration"
    },
    {
      id: 3,
      title: "Acknowledgement: DeerFlow",
      subtitle: "Open Source Deep Research Framework",
      description: "Originated from Open Source, give back to Open Source",
      link: "https://github.com/bytedance/deer-flow",
      color: "cyan",
      type: "acknowledgement",
      icon: Github
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % inspirationSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + inspirationSlides.length) % inspirationSlides.length);
  };

  return (
    <section className="landing-hero relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-screen">
      {/* Enhanced Background Pattern with Ghost Theme */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Floating Ghost Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 text-indigo-200/10"
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ghost className="h-24 w-24" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-1/3 text-purple-200/10"
          animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Ghost className="h-32 w-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-1/3 text-indigo-200/10"
          animate={{ y: [-10, 10, -10], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Ghost className="h-20 w-20" />
        </motion.div>
      </div>
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),rgba(139,92,246,0.08),transparent_80%)]" />

      {/* Main Content Container */}
      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16 md:px-8 lg:px-12">
        {/* Hero Content */}
        <div className="mx-auto max-w-6xl text-center">
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tagline */}
            <div className="mb-2">
              <span className="inline-block rounded-full bg-indigo-700/80 px-4 py-1 text-base font-bold text-white tracking-wide shadow-md border border-indigo-400/30">
                AI Outreach That Gets Replies
              </span>
            </div>
            {/* Ghost Icon with Animation */}
            <motion.div
              className="mx-auto mb-8 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <motion.div
                className="relative"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Ghost className="h-24 w-24 text-indigo-300/80" />
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl" />
              </motion.div>
            </motion.div>

            <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl xl:text-9xl leading-tight md:leading-tight">
              <span className="block md:inline">Stop Getting</span>
              <AuroraText className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text pt-4 md:pt-6">
                Ghosted
              </AuroraText>
            </h1>

            {/* Enhanced Subtitle with Unghost Theme */}
            <div className="mx-auto mt-8 max-w-4xl space-y-6">
              <p className="text-xl font-medium text-slate-100 md:text-2xl lg:text-3xl leading-tight">
                Meet <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent font-bold">Unghost Agent</span>, your AI-powered personalized outreach assistant.
              </p>
              <p className="mx-auto max-w-3xl text-base md:text-lg lg:text-xl text-slate-200 font-light leading-relaxed">
                Transform cold outreach from ignored messages to irresistible conversations. 
                Create high-converting outreach with deep prospect research, intelligent persona analysis, 
                and strategic message crafting that breaks through the noise.
              </p>
            </div>
            
            {/* WelcomeCard for landing page, visually aligned with onboarding */}
            <div className="mx-auto mt-10 max-w-2xl">
              <WelcomeCard
                title={<span>👋 Welcome to Unghost!</span>}
                description={
                  <>
                    Unghost Agent is your AI-powered personalized outreach assistant.<br />
                    Generate leads, research prospects, and craft messages that get replies—now with a seamless, unified experience from landing to chat.
                  </>
                }
              />
            </div>
          </motion.div>

          {/* Enhanced Action Buttons with Micro-interactions */}
          <motion.div 
            className="flex flex-col items-center justify-center gap-6 pt-12 sm:flex-row"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Primary CTA with pulse animation */}
            <motion.div
              className="relative"
              onHoverStart={() => setIsHoveringPrimary(true)}
              onHoverEnd={() => setIsHoveringPrimary(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background glow + pulse */}
              <motion.div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 blur-sm"
                animate={{
                  opacity: isHoveringPrimary ? 0.9 : 0.4,
                  scale: isHoveringPrimary ? 1.05 : 1,
                  boxShadow: isHoveringPrimary
                    ? "0 0 0 8px rgba(99,102,241,0.15)"
                    : "0 0 0 0px rgba(99,102,241,0.10)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  animation: 'pulse 2s infinite',
                }}
              />
              <Button
                className="group relative h-16 transform rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-14 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus-visible:ring-4 focus-visible:ring-indigo-400"
                asChild
              >
                <Link
                  target={
                    env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY ? "_blank" : undefined
                  }
                  href={
                    env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY
                      ? "https://github.com/storyarcade/unghost"
                      : "/chat"
                  }
                  className="flex items-center gap-4"
                >
                  <motion.div
                    animate={isHoveringPrimary ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  Get Started Free
                  <motion.div
                    animate={isHoveringPrimary ? { x: 4 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            {/* Secondary CTA */}
            <motion.div
              className="relative"
              onHoverStart={() => setIsHoveringSecondary(true)}
              onHoverEnd={() => setIsHoveringSecondary(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="h-16 rounded-2xl border-2 border-indigo-400/60 bg-slate-900/60 px-10 text-lg font-semibold text-indigo-200 hover:bg-indigo-950/40 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-400/50 focus-visible:ring-4 focus-visible:ring-indigo-400"
                asChild
              >
                <Link href="#how-it-works" className="flex items-center gap-3">
                  <Search className="h-5 w-5" />
                  See How It Works
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 pt-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a
              href="https://x.com/heypeter1111"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-blue-600/15 border-2 border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:from-blue-500/25 hover:to-blue-600/25 hover:border-blue-400/60 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/40 group-hover:bg-blue-500/30 transition-all">
                  <Twitter className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                </div>
                <div className="text-left">
                  <div className="text-blue-200 font-semibold text-sm">@heypeter1111</div>
                  <div className="text-blue-300/70 text-xs">Follow on X</div>
                </div>
              </div>
            </motion.a>
            
            <motion.a
              href="https://github.com/storyarcade/unghost"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/15 to-purple-600/15 border-2 border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:from-purple-500/25 hover:to-purple-600/25 hover:border-purple-400/60 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 border border-purple-400/40 group-hover:bg-purple-500/30 transition-all">
                  <Github className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
                </div>
                <div className="text-left">
                  <div className="text-purple-200 font-semibold text-sm">Unghost</div>
                  <div className="text-purple-300/70 text-xs">Star on GitHub</div>
                </div>
              </div>
            </motion.a>
          </motion.div>
          
          {/* Inspiration & Acknowledgement Carousel */}
          <motion.div
            className="space-y-10 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <motion.div 
                className="mx-auto max-w-4xl mt-8 px-4 py-3 rounded-2xl bg-slate-900/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <h3 className="text-center text-sm font-medium text-slate-300 mb-3">
                  💡 Inspiration & Acknowledgements
                </h3>
                
                <div className="relative px-12 md:px-14">
                  {/* Carousel Container */}
                  <div className="relative overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col md:flex-row items-center gap-6 p-6 min-h-[200px]"
                      >
                        {inspirationSlides[currentSlide]?.type === "inspiration" ? (
                          <>
                            {/* Image Section for Inspiration */}
                            <div className="relative w-full md:w-1/2 group cursor-pointer"
                                 onClick={() => window.open(inspirationSlides[currentSlide].link, "_blank")}>
                              <div className="relative overflow-hidden rounded-xl border border-slate-600/50 bg-slate-700/30">
                                <img 
                                  src={inspirationSlides[currentSlide].image} 
                                  alt={inspirationSlides[currentSlide].title}
                                  className="w-full h-auto max-h-40 object-contain transition-all duration-300 group-hover:brightness-110"
                                />
                                <div className={cn(
                                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                  inspirationSlides[currentSlide].color === "indigo" 
                                    ? "bg-indigo-500/20" 
                                    : "bg-purple-500/20"
                                )} />
                                
                                {/* View on X Overlay */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ExternalLink className="h-3 w-3 text-slate-300" />
                                  <span className="text-xs text-slate-300">View on X</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Content Section for Inspiration */}
                            <div className="flex-1 text-center md:text-left">
                              <h4 className={cn(
                                "text-xl font-bold mb-2",
                                inspirationSlides[currentSlide].color === "indigo"
                                  ? "text-indigo-300"
                                  : "text-purple-300"
                              )}>
                                {inspirationSlides[currentSlide].title}
                              </h4>
                              <p className="text-sm text-slate-300 mb-3">
                                {inspirationSlides[currentSlide].description}
                              </p>
                              <a 
                                href={inspirationSlides[currentSlide].link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                                  inspirationSlides[currentSlide].color === "indigo"
                                    ? "text-indigo-300 hover:text-indigo-200"
                                    : "text-purple-300 hover:text-purple-200"
                                )}
                              >
                                <Twitter className="h-4 w-4" />
                                {inspirationSlides[currentSlide].author}
                              </a>
                            </div>
                          </>
                        ) : (
                          /* DeerFlow Acknowledgement Slide */
                          <div className="w-full flex flex-col items-center justify-center text-center">
                            {/* DeerFlow Icon */}
                            <motion.div
                              animate={{ y: [-3, 3, -3] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="mb-4"
                            >
                              <div className="relative">
                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-cyan-500/20 border-2 border-cyan-400/40">
                                  <Github className="h-10 w-10 text-cyan-400" />
                                </div>
                                <div className="absolute -inset-3 bg-cyan-500/10 rounded-xl blur-lg" />
                              </div>
                            </motion.div>
                            
                            {/* DeerFlow Content */}
                            <div className="max-w-md mx-auto">
                              <h4 className="text-xl font-bold text-cyan-300 mb-1">
                                {inspirationSlides[currentSlide].title}
                              </h4>
                              {inspirationSlides[currentSlide].subtitle && (
                                <p className="text-base text-cyan-200 mb-2">
                                  {inspirationSlides[currentSlide].subtitle}
                                </p>
                              )}
                              <p className="text-sm text-slate-300 italic mb-4">
                                "{inspirationSlides[currentSlide].description}"
                              </p>
                              <a 
                                href={inspirationSlides[currentSlide].link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 text-sm"
                              >
                                <Github className="h-4 w-4" />
                                <span className="font-medium">View on GitHub</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Navigation Buttons - Outside the content area */}
                    <button
                      onClick={prevSlide}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 backdrop-blur-sm transition-all hover:bg-slate-700/80 hover:text-white hover:border-slate-600 hover:scale-110"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-4 w-4 mx-auto" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute -right-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 backdrop-blur-sm transition-all hover:bg-slate-700/80 hover:text-white hover:border-slate-600 hover:scale-110"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                  
                  {/* Slide Indicators */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {inspirationSlides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          currentSlide === index
                            ? cn(
                                "w-6",
                                slide.color === "indigo" && "bg-indigo-400",
                                slide.color === "purple" && "bg-purple-400",
                                slide.color === "cyan" && "bg-cyan-400"
                              )
                            : "w-1.5 bg-slate-600 hover:bg-slate-500"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

          {/* Enhanced Core Features Grid with Ghost Theme */}
          <motion.div 
            className="pt-28"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            <h2 className="mb-16 text-3xl font-bold text-slate-100 md:text-4xl lg:text-5xl">
              How We Help You Unghost
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Search className="h-12 w-12 text-indigo-400" />,
                  title: "Deep Research",
                  description: "AI-powered prospect intelligence that finds hidden connection points and conversation starters",
                  accentColor: "indigo" as const,
                  delay: 0.1,
                },
                {
                  icon: <Brain className="h-12 w-12 text-purple-400" />,
                  title: "Smart Personalization", 
                  description: "Behavioral analysis and communication style mapping for authentic, tailored messaging",
                  accentColor: "purple" as const,
                  delay: 0.2,
                },
                {
                  icon: <MessageCircle className="h-12 w-12 text-violet-400" />,
                  title: "Irresistible Messages",
                  description: "AI-crafted outreach that demonstrates genuine research and drives meaningful responses",
                  accentColor: "violet" as const,
                  delay: 0.3,
                },
                {
                  icon: <TrendingUp className="h-12 w-12 text-cyan-400" />,
                  title: "High Response Rates",
                  description: "Transform your outreach from ghosted to replied with data-driven message optimization",
                  accentColor: "cyan" as const,
                  delay: 0.4,
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + feature.delay, ease: "easeOut" }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    accentColor={feature.accentColor}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="pt-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-400 md:text-5xl">3x</div>
                <div className="text-slate-300 mt-2">Higher Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 md:text-5xl">85%</div>
                <div className="text-slate-300 mt-2">Personalization Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 md:text-5xl">2min</div>
                <div className="text-slate-300 mt-2">Average Setup Time</div>
              </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <p className="text-slate-400 text-lg">
              Built by{" "}
              <a 
                href="https://twitter.com/heypeter1111" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors"
              >
                @heypeter1111
              </a>
              {" "}• Open Source • MIT Licensed
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: "indigo" | "purple" | "violet" | "cyan";
}

function FeatureCard({
  icon,
  title,
  description,
  accentColor,
}: FeatureCardProps) {
  const accentClasses = {
    indigo: "group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20",
    purple: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/20",
    violet: "group-hover:border-violet-500/50 group-hover:shadow-violet-500/20",
    cyan: "group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/20",
  };

  return (
    <div className={cn(
      "group transform rounded-3xl border border-slate-700/60 bg-slate-800/40 p-10 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-4 hover:bg-slate-700/50 hover:shadow-2xl",
      accentClasses[accentColor]
    )}>
      <div className="flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-700/60 transition-all duration-500 group-hover:scale-110 group-hover:bg-slate-600/70">
          {icon}
        </div>
      </div>
      <h4 className="mt-8 text-xl font-bold text-white">{title}</h4>
      <p className="mt-4 text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

interface FeatureTagProps {
  label: string;
  color: "indigo" | "purple" | "violet" | "cyan";
}

function FeatureTag({ label, color }: FeatureTagProps) {
  const colorClasses = {
    indigo: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300 hover:border-indigo-400/60 hover:bg-indigo-500/25",
    purple: "border-purple-500/40 bg-purple-500/15 text-purple-300 hover:border-purple-400/60 hover:bg-purple-500/25",
    violet: "border-violet-500/40 bg-violet-500/15 text-violet-300 hover:border-violet-400/60 hover:bg-violet-500/25",
    cyan: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/25",
  };

  return (
    <div className={cn(
      "rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-default",
      colorClasses[color]
    )}>
      {label}
    </div>
  );
}