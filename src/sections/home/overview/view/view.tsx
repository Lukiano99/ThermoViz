"use client";
import { Container, Grid, Skeleton } from "@mui/material";

import { useSettingsContext } from "@/components/settings";
import { api } from "@/trpc/react";

import EnergyConsumptionWidget from "../energy-consumption-widget";
import OverviewWidgetSummary from "../overview-widget-summary";

export default function HomeOverviewView() {
  const settings = useSettingsContext();

  const { data: averageTemperatures, isLoading: isLoadingAverageTemperatures } =
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
          {isLoadingAverageTemperatures && (
            <Skeleton sx={{ width: "100%", height: "100%" }} />
          )}
          {!isLoadingAverageTemperatures && averageTemperatures && (
            <OverviewWidgetSummary
              title="Average Temperatures last 7 days"
              percent={averageTemperatures.percentageDifference}
              UOM="°C"
              total={averageTemperatures.averageTemperatureLastNDays}
              chart={{
                series: averageTemperatures?.temperaturesArray,
              }}
              lastDays={7}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
