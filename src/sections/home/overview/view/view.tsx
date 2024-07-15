"use client";
import { Container, Grid } from "@mui/material";

import { useSettingsContext } from "@/components/settings";

import OverviewWidgetSummary from "../overview-widget-summary";

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
          {/* <EnergyConsumptionWidget
            lastDays={10}
            title="Total Energy Delivered in the Last 10 Days"
            UOM="MWh"
          /> */}
        </Grid>

        <Grid xs={12} md={4} item>
          <OverviewWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
