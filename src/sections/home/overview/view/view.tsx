"use client";
import { Container, Grid } from "@mui/material";

import { useSettingsContext } from "@/components/settings";
import { api } from "@/trpc/react";

import OverviewWidgetSummary from "../overview-widget-summary";

export default function HomeOverviewView() {
  const settings = useSettingsContext();

  const { data: totalEnergyLast7Days, isLoading } =
    api.measurement.totalEnergyLast7Days.useQuery();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          {isLoading && <p>Loading...</p>}
          {!isLoading && totalEnergyLast7Days && (
            <OverviewWidgetSummary
              title="Total Energy Last 7 days"
              percent={totalEnergyLast7Days.percentageDifference}
              UOM="MWh"
              total={totalEnergyLast7Days.totalEnergyLast7Days}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={4} item>
          <OverviewWidgetSummary
            title="Total Installed"
            percent={0.2}
            total={4876}
            chart={{
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
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
