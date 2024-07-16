"use client";
import { Container, Grid, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useSettingsContext } from "@/components/settings";
import { api } from "@/trpc/react";

import OverviewWidgetSummary from "../overview-widget-summary";

import EnergyConsumptionWidget from "./energy-consumption-widget";

export default function HomeOverviewView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const { data: totalLocationsMonitored, isLoading } =
    api.measurement.totalLocationsMonitored.useQuery();

  const { data: averageTemperatures } =
    api.measurement.averageAmbientTemperature.useQuery({
      nDaysAgo: 5,
    });

  console.log({ averageTemperatures });

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
          {isLoading && <Skeleton sx={{ width: "100%", height: "100%" }} />}
          {!isLoading && totalLocationsMonitored && (
            <OverviewWidgetSummary
              title="Total Locations Monitored"
              percent={0}
              UOM="locations"
              total={totalLocationsMonitored}
              chart={{
                colors: [
                  theme.palette.warning.light,
                  theme.palette.warning.main,
                ],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
