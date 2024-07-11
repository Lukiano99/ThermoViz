"use client";

import { useCallback, useMemo, useState } from "react";
import isEqual from "lodash/isEqual";
import { useLocalStorage } from "src/hooks/use-local-storage";

import { type SettingsValueProps } from "../types";

import { SettingsContext } from "./settings-context";

// ----------------------------------------------------------------------

const STORAGE_KEY = "settings";

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultSettings: SettingsValueProps;
};

export function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { state, update, reset } = useLocalStorage(
    STORAGE_KEY,
    defaultSettings,
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const memoizedValue = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...state,
      onUpdate: update,
      // Reset
      canReset,
      onReset: reset,
      // Drawer
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [reset, update, state, canReset, openDrawer, onCloseDrawer, onToggleDrawer],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
