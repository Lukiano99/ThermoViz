import type { Metadata, Viewport } from "next";
import { AuthProvider } from "src/auth/context/supabase";
import { MotionLazy } from "src/components/animate/motion-lazy";
import ProgressBar from "src/components/progress-bar";
import { SettingsDrawer, SettingsProvider } from "src/components/settings";
import ThemeProvider from "src/theme";
import { primaryFont } from "src/theme/typography";

// ----------------------------------------------------------------------
import { TRPCReactProvider } from "@/trpc/react";

import "@/styles/globals.css";

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "T3 Minimal UI Kit",
  description:
    "The starting point for your next project with T3 Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style",
  keywords: "react,material,kit,application,dashboard,admin,template",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/apple-touch-icon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <TRPCReactProvider>
        <body className={primaryFont.className}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: "light",
                themeDirection: "ltr", //  'rtl' | 'ltr'
                themeContrast: "default",
                themeLayout: "vertical",
                themeColorPresets: "default",
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SettingsDrawer />
                  <ProgressBar />
                  {children}
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </body>
      </TRPCReactProvider>
    </html>
  );
}
