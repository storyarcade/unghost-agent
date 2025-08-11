// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { Github } from "lucide-react";
import Link from "next/link";

import { AuroraText } from "~/components/magicui/aurora-text";
import { Button } from "~/components/ui/button";

import { SectionHeader } from "../components/section-header";

export function JoinCommunitySection() {
  return (
    <section className="flex w-full flex-col items-center justify-center pb-12">
      <SectionHeader
        anchor="join-community"
        title={
          <AuroraText colors={["#60A5FA", "#A5FA60", "#A560FA"]}>
            Join the Unghost Agent Community
          </AuroraText>
        }
        description="Contribute brilliant ideas to shape the future of Unghost Agent. Collaborate, innovate, and make impacts."
      />
      <Button className="landing-secondary-button-enhanced text-xl px-8 py-4 rounded-xl min-w-[180px] h-[56px] flex items-center justify-center gap-3" size="lg" asChild>
        <Link href="https://github.com/storyarcade/unghost" target="_blank" className="flex items-center justify-center gap-3 w-full h-full">
          <Github className="h-6 w-6" />
          Contribute Now
        </Link>
      </Button>
    </section>
  );
}
