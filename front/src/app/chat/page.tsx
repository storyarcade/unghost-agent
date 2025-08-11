// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

"use client";

import { GithubOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";

import { Logo } from "../../components/unghost-agent/logo";
import { ThemeToggle } from "../../components/unghost-agent/theme-toggle";
import { Tooltip } from "../../components/unghost-agent/tooltip";
import { SettingsDialog } from "../settings/dialogs/settings-dialog";
import { OnboardingDialog } from "./components/onboarding-dialog";

const Main = dynamic(() => import("./main"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      Loading Unghost Agent...
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen justify-center overscroll-none">
      <header className="fixed top-0 left-0 flex h-12 w-full items-center justify-between px-4">
        <Logo />
        <div className="flex items-center">
          <Tooltip title="Star Unghost Agent on GitHub">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/storyarcade/unghost"
                target="_blank"
              >
                <GithubOutlined />
              </Link>
            </Button>
          </Tooltip>
          <ThemeToggle />
          <Suspense>
            <SettingsDialog />
          </Suspense>
        </div>
      </header>
      <Main />
      <OnboardingDialog />
    </div>
  );
}
