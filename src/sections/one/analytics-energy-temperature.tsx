import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Card, { type CardProps } from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { type ApexOptions } from "apexcharts";
import Chart, { useChart } from "src/components/chart";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[][];
    series: {
      month: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function AnalyticsEnergyTemperature({
  title,
  subheader,
  chart,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState("April");

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      // type: "gradient",
      // gradient: {
      //   colorStops: colors.map((colr) => [
      //     { offset: 0, color: colr[0], opacity: 1 },
      //     { offset: 100, color: colr[1], opacity: 1 },
      //   ]),
      // },
    },
    xaxis: {
      categories,
      title: {
        text: "Energy [KWh]",
      },
    },

    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover],
  );

  return (
    <>
      <Card {...other} sx={{ minHeight: "492px" }}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: "subtitle2",
                bgcolor: "background.neutral",
              }}
            >
              {seriesData}

              <Iconify
                width={16}
                icon={
                  popover.open
                    ? "eva:arrow-ios-upward-fill"
                    : "eva:arrow-ios-downward-fill"
                }
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        {series.map((item, idx) => (
          <Box key={idx} sx={{ mt: 3, mx: 3 }}>
            {item.month === seriesData && (
              <Chart
                dir="ltr"
                type="line"
                series={item.data}
                options={chartOptions}
                width="100%"
                height={364}
              />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        {series.map((option, idx) => (
          <MenuItem
            key={idx}
            selected={option.month === seriesData}
            onClick={() => handleChangeSeries(option.month)}
          >
            {option.month}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}