"use client";
import { useState } from "react";
import { Container, Grid, Skeleton, Typography } from "@mui/material";

import { useAuthContext } from "@/auth/hooks";
import { useSettingsContext } from "@/components/settings";
import AnalyticsEnergyTemperature from "@/sections/data-analysis/analytics/analytics-energy-temperature";
import { api } from "@/trpc/react";

import OverviewEnergyByLocation from "../overview-current-download";
import OverviewEnergyConsumptionWidget from "../overview-energy-consumption-widget";
import OverviewLocations from "../overview-locations";
import OverviewRecentMeasurements from "../overview-recent-measurements";
import OverviewWidgetSummary from "../overview-widget-summary";

export default function HomeOverviewView() {
  const settings = useSettingsContext();
  const [chartMonth, setChartMonth] = useState("april");
  const { data: averageTemperatures, isLoading: isLoadingAverageTemperatures } =
    api.measurement.averageAmbientTemperature.useQuery({
      nDaysAgo: 5,
    });

  const {
    data: totalEnergyConsumptionByLocation,
    isLoading: isLoadingByLocation,
  } = api.measurement.getTotalEnergyConsumptionByLocation.useQuery();

  const {
    data: energyAndTemperatureData,
    isLoading: isLoadingEnergyAndTemperatureData,
  } = api.measurement.getEnergyAndAmbientTemperatureData.useQuery({
    month: chartMonth,
  });
  const { data: recentMeasurements, isLoading: isLoadingRecent } =
    api.measurement.getRecent.useQuery();

  const { data: avgTempByLocation, isLoading: isLoadingAvgTempByLocation } =
    api.measurement.getAverageTemperatureByLocation.useQuery();

  const { user } = useAuthContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      {user?.displayName && (
        <Typography
          variant="h3"
          sx={{
            paddingBottom: 5,
          }}
        >
          Welcome back,{" "}
          {user.displayName !== "undefined" ? user.displayName : "User"} 👋
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          <OverviewEnergyConsumptionWidget lastDays={7} UOM="MWh" />
        </Grid>

        <Grid xs={12} md={4} item>
          <OverviewEnergyConsumptionWidget lastDays={10} UOM="MWh" />
        </Grid>

        <Grid xs={12} md={4} item sx={{ height: "100%", width: "100%" }}>
          {isLoadingAverageTemperatures && (
            <Skeleton sx={{ width: "100%", minHeight: "150px" }} />
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

        <Grid xs={12} md={6} lg={4} item>
          {isLoadingByLocation && (
            <Skeleton
              sx={{
                width: "100%",
                minHeight: "492px",
              }}
            />
          )}
          {!isLoadingByLocation && totalEnergyConsumptionByLocation && (
            <OverviewEnergyByLocation
              title="Energy Consumption by Location"
              UOM="MWh"
              chart={{
                series: totalEnergyConsumptionByLocation.data.map((loc) => ({
                  label: loc.location.slice(-3),
                  value: loc.totalEnergyConsumptionByLocation,
                })),
              }}
            />
          )}
        </Grid>
        <Grid xs={12} lg={8} item>
          {isLoadingEnergyAndTemperatureData && (
            <Skeleton
              sx={{
                width: "100%",
                minHeight: "492px",
              }}
            />
          )}
          {energyAndTemperatureData && (
            <AnalyticsEnergyTemperature
              onMonthChange={(month) => setChartMonth(month)}
              month={chartMonth}
              title="Temperature vs Consumed Energy"
              subheader="Graph of temperature dependence on consumed energy
"
              chart={{
                categories: energyAndTemperatureData.map((data) =>
                  data.energy.toString(),
                ),
                series: [
                  {
                    month: chartMonth,
                    data: [
                      {
                        name: "t_amb",
                        data: energyAndTemperatureData.map(
                          (data) => data.t_amb,
                        ),
                      },
                    ],
                  },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} lg={8} item>
          {isLoadingRecent && !recentMeasurements && (
            <Skeleton sx={{ width: "100%", height: "492px" }} />
          )}
          {!isLoadingRecent && recentMeasurements && (
            <OverviewRecentMeasurements
              title="The last 10 measurements in the system"
              tableData={recentMeasurements}
              tableLabels={[
                { id: "date", label: "Date" },
                { id: "time", label: "Time" },
                { id: "location", label: "Location" },
                { id: "energy", label: "Energy" },
                { id: "power", label: "Power" },
                { id: "" },
              ]}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={4} item>
          {isLoadingAvgTempByLocation && !avgTempByLocation && (
            <Skeleton sx={{ width: "100%", height: "492px" }} />
          )}
          {!isLoadingAvgTempByLocation && avgTempByLocation && (
            <OverviewLocations
              title="Today's Average Temperatures by Location"
              list={avgTempByLocation}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
