"use client";
import { Container, Grid, Skeleton } from "@mui/material";

import { useSettingsContext } from "@/components/settings";
import { api } from "@/trpc/react";

import EnergyConsumptionWidget from "../energy-consumption-widget";
import TemperatureDifference from "../overview-area-installed";
import EnergyByLocation from "../overview-current-download";
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

        <Grid xs={12} md={6} lg={4} item>
          {isLoadingByLocation && (
            <Skeleton sx={{ width: "100%", height: "100%" }} />
          )}
          {!isLoadingByLocation && totalEnergyConsumptionByLocation && (
            <EnergyByLocation
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
            <Skeleton sx={{ width: "100%", height: "100%" }} />
          )}
          {monthTemperatureData && (
            <TemperatureDifference
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
                // series: [
                //   {
                //     year: "2019",
                //     data: [
                //       {
                //         name: "Asia",
                //         data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                //       },
                //       {
                //         name: "America",
                //         data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                //       },
                //     ],
                //   },
                //   {
                //     year: "2020",
                //     data: [
                //       {
                //         name: "Asia",
                //         data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                //       },
                //       {
                //         name: "America",
                //         data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                //       },
                //     ],
                //   },
                // ],
              }}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
