"use client";

import { useState } from "react";
import { Grid, Skeleton, useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import { useSettingsContext } from "src/components/settings";

import OverviewTemperatureDifference from "@/sections/home/overview/overview-temperature-difference";
import { api } from "@/trpc/react";

import AnalyticsTempPerLocation from "../analytics-temp-per-location";
import AnalyticsWidgetSummary from "../analytics-widget-summary";

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const [chartMonth, setChartMonth] = useState("april");

  const { data: monthTemperatureData, isLoading: isLoadingMonthTemperature } =
    api.measurement.getMonthTemperatureData.useQuery({
      month: chartMonth,
    });

  const { data: avgLocationsTemps, isLoading: isLoadingAvgLocTemps } =
    api.analytics.getLocationsAvgTemp.useQuery({
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-01"),
    });

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          <AnalyticsWidgetSummary
            title="Achieved savings"
            percent={2.6}
            total={765}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={4} item>
          <AnalyticsWidgetSummary
            title="Total energy consumption"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={4} item>
          <AnalyticsWidgetSummary
            title="Balance"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8} item>
          {isLoadingMonthTemperature && (
            <Skeleton sx={{ width: "100%", height: "492px" }} />
          )}
          {monthTemperatureData && (
            <OverviewTemperatureDifference
              onMonthChange={(month) => setChartMonth(month)}
              month={chartMonth}
              title="Supply & Return in °C"
              subheader="Temperature difference between primary supply and return in the primary circuit"
              chart={{
                categories: monthTemperatureData.map((data) =>
                  data.day.toLocaleDateString("en-US", { day: "2-digit" }),
                ),
                series: [
                  {
                    month: chartMonth,
                    data: [
                      {
                        name: "prim circuit sup",
                        data: monthTemperatureData.map(
                          (data) => data.average_t_sup_prim,
                        ),
                      },
                      {
                        name: "prim circuit ret",
                        data: monthTemperatureData.map(
                          (data) => data.average_t_ret_prim,
                        ),
                      },
                    ],
                  },
                ],
              }}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={4} item>
          {avgLocationsTemps && !isLoadingAvgLocTemps && (
            <AnalyticsTempPerLocation
              title="Average Temperature by Location"
              total={2324}
              chart={{
                // series: [
                //   { label: "Mens", value: 44 },
                //   { label: "Womens", value: 75 },
                // ],
                series: avgLocationsTemps.map((loc) => ({
                  label: loc.location,
                  value: loc.avg_temp,
                })),
              }}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
