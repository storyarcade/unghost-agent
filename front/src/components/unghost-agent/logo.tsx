// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link
      className="opacity-70 transition-opacity duration-300 hover:opacity-100 flex items-center gap-2"
      href="/"
    >
      <Image
        src="/images/unghost-agent-icon.svg"
        alt="Unghost Agent"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span className="font-semibold text-lg">Unghost Agent</span>
    </Link>
  );
}
