import { type UnghostAgentConfig } from "../config/types";

import { resolveServiceURL } from "./resolve-service-url";

declare global {
  interface Window {
    __unghostAgentConfig: UnghostAgentConfig;
  }
}

export async function loadConfig() {
  const res = await fetch(resolveServiceURL("./config"));
  const config = await res.json();
  return config;
}

export function getConfig(): UnghostAgentConfig {
  if (
    typeof window === "undefined" ||
    typeof window.__unghostAgentConfig === "undefined"
  ) {
    throw new Error("Config not loaded");
  }
  return window.__unghostAgentConfig;
}
