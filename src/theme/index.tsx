"use client";

import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  type ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import merge from "lodash/merge";
import { useSettingsContext } from "src/components/settings";

import { createContrast } from "./options/contrast";
import { createPresets } from "./options/presets";
// options
import { customShadows } from "./custom-shadows";
import NextAppDirEmotionCacheProvider from "./next-emotion-cache";
import { componentsOverrides } from "./overrides";
// system
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();

  const presets = createPresets(settings.themeColorPresets);

  const contrast = createContrast(settings.themeContrast, settings.themeMode);

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(settings.themeMode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.themeMode),
        ...presets.customShadows,
      },
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [
      settings.themeMode,
      presets.palette,
      presets.customShadows,
      contrast.palette,
    ],
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  theme.components = merge(componentsOverrides(theme), contrast.components);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
