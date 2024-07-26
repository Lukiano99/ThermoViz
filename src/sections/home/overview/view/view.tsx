"use client";
import { Container, Grid, Skeleton } from "@mui/material";

import { useSettingsContext } from "@/components/settings";
import { api } from "@/trpc/react";

import OverviewTemperatureDifference from "../overview-area-installed";
import OverviewEnergyByLocation from "../overview-current-download";
import OverviewEnergyConsumptionWidget from "../overview-energy-consumption-widget";
import OverviewLocations from "../overview-locations";
import OverviewRecentMeasurements from "../overview-recent-measurements";
import OverviewWidgetSummary from "../overview-widget-summary";

export default function HomeOverviewView() {
  const settings = useSettingsContext();

  const { data: averageTemperatures, isLoading: isLoadingAverageTemperatures } =
    api.measurement.averageAmbientTemperature.useQuery({
      nDaysAgo: 5,
    });

  const {
    data: totalEnergyConsumptionByLocation,
    isLoading: isLoadingByLocation,
  } = api.measurement.getTotalEnergyConsumptionByLocation.useQuery();

  const { data: monthTemperatureData, isLoading: isLoadingMonthTemperature } =
    api.measurement.getMonthTemperatureData.useQuery();

  const { data: recentMeasurements, isLoading: isLoadingRecent } =
    api.measurement.getRecent.useQuery();

  const { data: avgTempByLocation, isLoading: isLoadingAvgTempByLocation } =
    api.measurement.getAverageTemperatureByLocation.useQuery();
  console.log({ avgTempByLocation });
  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
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
            <Skeleton sx={{ width: "100%", minHeight: "492px" }} />
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

        <Grid xs={12} md={6} lg={8} item>
          {isLoadingMonthTemperature && (
            <Skeleton sx={{ width: "100%", height: "492px" }} />
          )}
          {monthTemperatureData && (
            <OverviewTemperatureDifference
              title="Supply & Return in °C"
              subheader="Temperature difference between primary supply and return in the primary circuit"
              chart={{
                categories: monthTemperatureData.map((data) =>
                  data.day.toLocaleDateString("en-US", { day: "2-digit" }),
                ),
                series: [
                  ...new Set(monthTemperatureData.map((item) => item.month)),
                ].map((month) => ({
                  month: month,
                  data: [
                    {
                      name: "Supply T  in the Primary Circuit",
                      data: monthTemperatureData
                        .filter((monthData) => monthData.month === month)
                        .map((finalData) => finalData.average_t_sup_prim),
                    },
                    {
                      name: "Return T  in the Primary Circuit",
                      data: monthTemperatureData
                        .filter((monthData) => monthData.month === month)
                        .map((finalData) => finalData.average_t_ret_prim),
                    },
                  ],
                })),
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
