"use client";

import { Grid, Skeleton } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import Container from "@mui/material/Container";
import { useSettingsContext } from "src/components/settings";

import SvgColor from "@/components/svg-color";
import { api } from "@/trpc/react";

import LocationOverview from "../location-overview";

// ----------------------------------------------------------------------
const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/locations/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  thermo: icon("ic_thermo"),
  celsius: icon("ic_celsius"),
  energy: icon("ic_energy"),
  deltaT: icon("ic_delta-t"),
  system: icon("ic_system"),
  clock: icon("ic_clock"),
};
export default function LocationsView() {
  const settings = useSettingsContext();

  const { data: locationsStats, isLoading } =
    api.locations.getLocationStats.useQuery();

  const sumEnergy = locationsStats
    ?.map((loc) => loc.totalDailyEnergy)
    .reduce((acc, energy) => acc + energy, 0);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      {/* <Typography variant="h3">Hello, user</Typography> */}

      {!locationsStats && isLoading && (
        <Grid container spacing={3}>
          {Array(5)
            .fill(null)
            .map((_, idx) => (
              <Grid xs={12} md={4} item key={idx}>
                <Skeleton
                  sx={{
                    width: 1,
                    height: "650px",
                  }}
                />
              </Grid>
            ))}
        </Grid>
      )}

      {locationsStats && sumEnergy && !isLoading && (
        <Grid container spacing={3}>
          {locationsStats.map((loc, idx) => {
            const consumptionShare = Number(
              ((loc.totalDailyEnergy / sumEnergy) * 100).toFixed(2),
            );

            return (
              <Grid xs={12} md={4} item key={idx}>
                <LocationOverview
                  title={loc.location}
                  total={sumEnergy}
                  consumption={loc.totalDailyEnergy}
                  latestMeasurementTime={loc.latestMeasurementTime}
                  latestUpdateTime={loc.fetchingTime}
                  chart={{
                    series: consumptionShare,
                    colors:
                      idx % 2 === 0
                        ? [green[500], green[700]]
                        : [blue[500], blue[700]],
                  }}
                  data={[
                    {
                      name: "Current Ambient Temperature",
                      value: loc.currentTemp,
                      filesCount: 223,
                      icon: ICONS.celsius,
                      description: "Temperature at this moment",
                      UOM: "°C",
                    },
                    {
                      name: "Average Daily Temperature",
                      value: loc.avgDailyTemp,
                      filesCount: 223,
                      icon: ICONS.thermo,
                      description: loc.avgDailyTemp.toString(),
                      UOM: "°C",
                    },
                    {
                      name: "Temperature Difference",
                      value: loc.tempDifference,
                      filesCount: 223,
                      icon: ICONS.deltaT,
                      description: "t_prim_sup & t_prim_ret",
                      UOM: "°C",
                    },
                    {
                      name: "Daily Energy Consumption",
                      value: loc.totalDailyEnergy,
                      filesCount: 223,
                      icon: ICONS.energy,
                      description: "Energy sum of every measurement record",
                      UOM: "KWh",
                    },
                    {
                      name: "System Status",
                      // value: loc.systemStatus,
                      value: 5,
                      filesCount: 223,
                      icon: ICONS.system,
                      description: "Shows how system works",
                    },
                  ]}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
