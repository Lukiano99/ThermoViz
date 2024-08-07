"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useSettingsContext } from "src/components/settings";

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Typography variant="h4">Home Page</Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      ></Box>
    </Container>
  );
}
