"use client";

import { Grid, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useSettingsContext } from "src/components/settings";

import OverviewTemperatureDifference from "@/sections/home/overview/overview-temperature-difference";
import { api } from "@/trpc/react";

import AnalyticsEnergyTemperature from "../analytics-energy-temperature";

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const {
    data: energyAndTemperatureData,
    isLoading: isLoadingEnergyAndTemperatureData,
  } = api.measurement.getEnergyAndAmbientTemperatureData.useQuery({
    month: "april",
  });
  // console.log({ energyAndTemperatureData });

  const generateRoundedArray = (inputArray: number[]) => {
    if (inputArray.length === 0) {
      throw new Error("Input array must not be empty");
    }

    const min = Math.min(...inputArray);
    const max = Math.max(...inputArray);

    const step = (max - min) / 9; // We divide by 9 to create 10 evenly spaced steps

    const roundedStep = Math.round(step / 5) * 5; // Round to the nearest 5

    const resultArray = [];
    for (let i = 0; i < 10; i++) {
      resultArray.push(Math.round((min + i * roundedStep) / 5) * 5);
    }

    // Ensure the last element is the maximum value, rounded to the nearest 5
    resultArray[9] = Math.round(max / 5) * 5;

    return resultArray;
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid xs={12} md={6} lg={8} item>
        {isLoadingEnergyAndTemperatureData && (
          <Skeleton sx={{ width: "100%", height: "492px" }} />
        )}
        {energyAndTemperatureData && (
          <AnalyticsEnergyTemperature
            title="Graph of temperature dependence on consumed energy"
            subheader="Temperature difference between primary supply and return in the primary circuit"
            chart={{
              categories: energyAndTemperatureData.map((data) =>
                data.energy.toString(),
              ),
              series: [
                {
                  month: "April",
                  data: [
                    {
                      name: "t_amb",
                      // data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
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
