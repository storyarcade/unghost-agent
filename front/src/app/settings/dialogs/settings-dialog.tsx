// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

import { Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { Tooltip } from "~/components/unghost-agent/tooltip";
import { useReplay } from "~/core/replay";
import {
  type SettingsState,
  changeSettings,
  saveSettings,
  useSettingsStore,
} from "~/core/store";
import { cn } from "~/lib/utils";

import { SETTINGS_TABS } from "../tabs";

export function SettingsDialog() {
  const { isReplay } = useReplay();
  const [activeTabId, setActiveTabId] = useState(SETTINGS_TABS[0]!.id);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(useSettingsStore.getState());
  const [changes, setChanges] = useState<Partial<SettingsState>>({});

  const handleTabChange = useCallback(
    (newChanges: Partial<SettingsState>) => {
      setTimeout(() => {
        if (open) {
          setChanges((prev) => ({
            ...prev,
            ...newChanges,
          }));
        }
      }, 0);
    },
    [open],
  );

  const handleSave = useCallback(() => {
    if (Object.keys(changes).length > 0) {
      const newSettings: SettingsState = {
        ...settings,
        ...changes,
      };
      setSettings(newSettings);
      setChanges({});
      changeSettings(newSettings);
      saveSettings();
    }
    setOpen(false);
  }, [settings, changes]);

  const handleOpen = useCallback(() => {
    setSettings(useSettingsStore.getState());
  }, []);

  const handleClose = useCallback(() => {
    setChanges({});
  }, []);

  useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open, handleOpen, handleClose]);

  const mergedSettings = useMemo<SettingsState>(() => {
    return {
      ...settings,
      ...changes,
    };
  }, [settings, changes]);

  if (isReplay) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip title="Settings">
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Settings />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="sm:max-w-[850px] bg-white border-2 border-slate-300 shadow-2xl backdrop-blur-none">
        <DialogHeader className="border-b-2 border-slate-200 pb-4 bg-white">
          <DialogTitle className="text-slate-900 text-xl font-semibold">
            Unghost Agent Settings
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Manage your Unghost Agent settings here.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTabId}>
          <div className="flex h-120 w-full overflow-auto border-y-2 border-slate-200 bg-white">
            <ul className="flex w-50 shrink-0 border-r-2 border-slate-200 p-1 bg-slate-50">
              <div className="size-full">
                {SETTINGS_TABS.map((tab) => (
                  <li
                    key={tab.id}
                    className={cn(
                      "hover:bg-slate-100 hover:text-slate-900 mb-1 flex h-8 w-full cursor-pointer items-center gap-1.5 rounded px-2 transition-colors",
                      activeTabId === tab.id &&
                        "!bg-blue-600 !text-white shadow-md",
                    )}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <tab.icon size={16} />
                    <span className="font-medium">{tab.label}</span>
                    {tab.badge && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-slate-400 text-slate-600 ml-auto px-1 py-0 text-xs bg-white",
                          activeTabId === tab.id &&
                            "border-blue-200 text-blue-100 bg-blue-500/20",
                        )}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </li>
                ))}
              </div>
            </ul>
            <div className="min-w-0 flex-grow bg-white">
              <div
                id="settings-content-scrollable"
                className="size-full overflow-auto p-4 text-slate-900 bg-white"
              >
                {SETTINGS_TABS.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="m-0">
                    <tab.component
                      settings={mergedSettings}
                      onChange={handleTabChange}
                    />
                  </TabsContent>
                ))}
              </div>
            </div>
          </div>
        </Tabs>
        <DialogFooter className="border-t-2 border-slate-200 pt-4 bg-white">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700"
          >
            Cancel
          </Button>
          <Button 
            className="w-24 bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
            type="submit" 
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
