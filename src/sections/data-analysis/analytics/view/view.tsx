"use client";

import { useState } from "react";
import { Grid, Skeleton } from "@mui/material";
import Container from "@mui/material/Container";
import { useSettingsContext } from "src/components/settings";

import OverviewTemperatureDifference from "@/sections/home/overview/overview-temperature-difference";
import { api } from "@/trpc/react";

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const settings = useSettingsContext();
  const [chartMonth, setChartMonth] = useState("april");

  const { data: monthTemperatureData, isLoading: isLoadingMonthTemperature } =
    api.measurement.getMonthTemperatureData.useQuery({
      month: chartMonth,
    });

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid xs={12} md={6} lg={8} item>
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
      </Grid>
    </Container>
  );
}
