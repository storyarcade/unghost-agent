// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
