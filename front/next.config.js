/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import "./src/env.js";

/** @type {import("next").NextConfig} */

// Unghost Agent leverages **Turbopack** during development for faster builds and a smoother developer experience.
// However, in production, **Webpack** is used instead.
//
// This decision is based on the current recommendation to avoid using Turbopack for critical projects, as it
// is still evolving and may not yet be fully stable for production environments.

const config = {
  // For development mode
  turbopack: {
    rules: {
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },

  // For production mode
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },

  // Additional configurations to prevent build manifest corruption
  onDemandEntries: {
    // Prevent rapid compilation issues that can corrupt build manifests
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Disable strict mode in development to reduce HMR conflicts
  reactStrictMode: process.env.NODE_ENV === "production",

  // ... rest of the configuration.
  output: "standalone",
};

export default config;
