// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { create } from "zustand";

import type { MCPServerMetadata, SimpleMCPServerMetadata } from "../mcp";

const SETTINGS_KEY = "unghost-agent.settings";

const DEFAULT_SETTINGS: SettingsState = {
  general: {
    autoAcceptedPlan: false,
    maxPlanIterations: 1,
    maxStepNum: 3,
    maxSearchResults: 3,
    reportStyle: "friendly",
    userBackground: "",
  },
  mcp: {
    servers: [],
  },
};

export type SettingsState = {
  general: {
    autoAcceptedPlan: boolean;
    maxPlanIterations: number;
    maxStepNum: number;
    maxSearchResults: number;
    reportStyle: "aggressive" | "conservative" | "go_nuts" | "friendly";
    userBackground: string;
  };
  mcp: {
    servers: MCPServerMetadata[];
  };
};

export const useSettingsStore = create<SettingsState>(() => ({
  ...DEFAULT_SETTINGS,
}));

export const useSettings = (key: keyof SettingsState) => {
  return useSettingsStore((state) => state[key]);
};

export const changeSettings = (settings: SettingsState) => {
  useSettingsStore.setState(settings);
};

export const loadSettings = () => {
  if (typeof window === "undefined") {
    return;
  }
  const json = localStorage.getItem(SETTINGS_KEY);
  if (json) {
    try {
      const settings = JSON.parse(json);

      // Ensure settings.general exists and has all default keys
      settings.general = {
        ...DEFAULT_SETTINGS.general,
        ...(settings.general ?? {}),
      };

      // Ensure settings.mcp exists
      settings.mcp ??= DEFAULT_SETTINGS.mcp;
      
      useSettingsStore.setState(settings);
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
  }
};

export const saveSettings = () => {
  const latestSettings = useSettingsStore.getState();
  const json = JSON.stringify(latestSettings);
  localStorage.setItem(SETTINGS_KEY, json);
};

export const getChatStreamSettings = () => {
  let mcpSettings:
    | {
        servers: Record<
          string,
          MCPServerMetadata & {
            enabled_tools: string[];
            add_to_agents: string[];
          }
        >;
      }
    | undefined = undefined;
  const { mcp, general } = useSettingsStore.getState();
  const mcpServers = mcp.servers.filter((server) => server.enabled);
  if (mcpServers.length > 0) {
    mcpSettings = {
      servers: mcpServers.reduce((acc, cur) => {
        const { transport, env } = cur;
        let server: SimpleMCPServerMetadata;
        if (transport === "stdio") {
          server = {
            name: cur.name,
            transport,
            env,
            command: cur.command,
            args: cur.args,
          };
        } else {
          server = {
            name: cur.name,
            transport,
            env,
            url: cur.url,
          };
        }
        return {
          ...acc,
          [cur.name]: {
            ...server,
            enabled_tools: cur.tools.map((tool) => tool.name),
            add_to_agents: ["researcher"],
          },
        };
      }, {}),
    };
  }
  return {
    ...general,
    mcpSettings,
  };
};

export function setReportStyle(
  value: "aggressive" | "conservative" | "go_nuts" | "friendly",
) {
  useSettingsStore.setState((state) => ({
    general: {
      ...state.general,
      reportStyle: value,
    },
  }));
  saveSettings();
}

export function setUserBackground(value: string) {
  useSettingsStore.setState((state) => ({
    general: {
      ...state.general,
      userBackground: value,
    },
  }));
  saveSettings();
}

loadSettings();
