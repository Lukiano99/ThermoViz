"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSettingsContext } from "src/components/settings";

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Typography variant="h3">Hello, user</Typography>
    </Container>
  );
}
