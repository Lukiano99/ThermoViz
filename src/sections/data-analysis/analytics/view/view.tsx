"use client";

import { useState } from "react";
import { Grid, Skeleton } from "@mui/material";
import Container from "@mui/material/Container";
import { useSettingsContext } from "src/components/settings";

import { api } from "@/trpc/react";

import AnalyticsEnergyTemperature from "../analytics-energy-temperature";

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const settings = useSettingsContext();
  const [chartMonth, setChartMonth] = useState("april");
  console.log({ chartMonth });
  const {
    data: energyAndTemperatureData,
    isLoading: isLoadingEnergyAndTemperatureData,
  } = api.measurement.getEnergyAndAmbientTemperatureData.useQuery({
    month: chartMonth,
  });

  console.log({ energyAndTemperatureData });

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid xs={12} md={6} lg={8} item>
        {isLoadingEnergyAndTemperatureData && (
          <Skeleton sx={{ width: "100%", height: "492px" }} />
        )}
        {energyAndTemperatureData && (
          <AnalyticsEnergyTemperature
            onMonthChange={(month) => setChartMonth(month)}
            month={chartMonth}
            title="Graph of temperature dependence on consumed energy"
            subheader="Temperature difference between primary supply and return in the primary circuit"
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
                      data: energyAndTemperatureData.map((data) => data.t_amb),
                    },
                    // {
                    //   name: "America",
                    //   data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    // },
                  ],
                },
                // {
                //   year: "2020",
                //   data: [
                //     {
                //       name: "Asia",
                //       data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                //     },
                //     {
                //       name: "America",
                //       data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                //     },
                //   ],
                // },
              ],
            }}
          />
        )}
      </Grid>
    </Container>
  );
}
