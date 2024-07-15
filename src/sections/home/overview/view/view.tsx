"use client";
import { Container, Grid, Typography } from "@mui/material";

import { useSettingsContext } from "@/components/settings";

import OverviewWidgetSummary from "../overview-widget-summary";

export default function HomeOverviewView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>

      <Grid xs={12} md={4}>
        <OverviewWidgetSummary
          title="Total Active Users"
          percent={2.6}
          total={18765}
          chart={{
            series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
          }}
        />
      </Grid>
    </Container>
  );
}
