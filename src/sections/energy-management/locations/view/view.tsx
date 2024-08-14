"use client";

import { Box, Grid, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { useSettingsContext } from "src/components/settings";

import SvgColor from "@/components/svg-color";

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
  const GB = 1000000000 * 24;

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Typography variant="h3">Hello, user</Typography>
      <Grid container spacing={3}>
        <Grid item>
          <LocationOverview
            title="L22"
            currentTemperature={22}
            averageTemperature={21}
            totalDailyEnergy={1024}
            deltaT={4}
            status={"normal"}
            total={GB}
            chart={{
              series: 76,
            }}
            data={[
              {
                name: "Current Ambient Temperature",
                usedStorage: GB / 2,
                filesCount: 223,
                icon: ICONS.celsius,
              },
              {
                name: "Average Daily Temperature",
                usedStorage: GB / 5,
                filesCount: 223,
                icon: ICONS.thermo,
              },
              {
                name: "Total Daily Energy Consumption",
                usedStorage: GB / 5,
                filesCount: 223,
                icon: ICONS.energy,
              },
              {
                name: "Temperature Difference (Delta T)",
                usedStorage: GB / 10,
                filesCount: 223,
                icon: ICONS.deltaT,
              },
              {
                name: "System Status",
                usedStorage: GB / 10,
                filesCount: 223,
                icon: ICONS.system,
              },
              {
                name: "Last Update Time",
                usedStorage: GB / 10,
                filesCount: 223,
                icon: ICONS.clock,
              },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
