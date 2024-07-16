"use client";
import { Container, Grid } from "@mui/material";

import { useSettingsContext } from "@/components/settings";

import EnergyConsumptionWidget from "./energy-consumption-widget";

export default function HomeOverviewView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          <EnergyConsumptionWidget lastDays={7} UOM="MWh" />
        </Grid>

        <Grid xs={12} md={4} item>
          <EnergyConsumptionWidget lastDays={10} UOM="MWh" />
        </Grid>

        <Grid xs={12} md={4} item>
          <EnergyConsumptionWidget lastDays={14} UOM="MWh" />
        </Grid>
      </Grid>
    </Container>
  );
}
