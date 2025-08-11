// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import { ThemeProviderWrapper } from "~/components/unghost-agent/theme-provider-wrapper";
import { loadConfig } from "~/core/api/config";
import { env } from "~/env";

import { Toaster } from "../components/unghost-agent/toaster";

export const metadata: Metadata = {
  title: "👻 Unghost Agent",
  description:
    "AI-powered personalized outreach assistant that combines language models with specialized tools for lead generation and personalized messaging.",
  icons: [
    { rel: "icon", url: "/images/unghost-agent-favicon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/images/unghost-agent-icon.svg", sizes: "32x32", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/images/unghost-agent-icon.svg", sizes: "180x180" }
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const conf = await loadConfig();
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <head>
        <script>{`window.__unghostAgentConfig = ${JSON.stringify(conf)}`}</script>
        {/* Define isSpace function globally to fix markdown-it issues with Next.js + Turbopack
          https://github.com/markdown-it/markdown-it/issues/1082#issuecomment-2749656365 */}
        <Script id="markdown-it-fix" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && typeof window.isSpace === 'undefined') {
              window.isSpace = function(code) {
                return code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0B || code === 0x0C || code === 0x0D;
              };
            }
          `}
        </Script>
      </head>
      <body className="bg-app">
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <Toaster />
        {
          // NO USER BEHAVIOR TRACKING OR PRIVATE DATA COLLECTION BY DEFAULT
          //
          // When `NEXT_PUBLIC_STATIC_WEBSITE_ONLY` is `true`, the script will be injected
          // into the page only when `AMPLITUDE_API_KEY` is provided in `.env`
        }
        {env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && env.AMPLITUDE_API_KEY && (
          <>
            <Script src="https://cdn.amplitude.com/script/d2197dd1df3f2959f26295bb0e7e849f.js"></Script>
            <Script id="amplitude-init" strategy="lazyOnload">
              {`window.amplitude.init('${env.AMPLITUDE_API_KEY}', {"fetchRemoteConfig":true,"autocapture":true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
