import { useCallback, useEffect, useState } from "react";
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
import { api } from "@/trpc/react";
import { Month } from "@/server/api/routers/measurement";
import { popover } from "@/theme/overrides/components/popover";
import { Skeleton } from "@mui/material";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  onMonthChange?: (month: number) => void;
  month: number | undefined;
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

export default function OverviewTemperatureDifference({
  title,
  subheader,
  chart,
  onMonthChange,
  month,
  ...other
}: Props) {
  const theme = useTheme();
  const { data: availableMonths, isLoading: isLoadingMonths } =
    api.measurement.getDistinctMonths.useQuery();
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

  const [seriesData, setSeriesData] = useState<Month>(
    month === 0
      ? "january"
      : month === 1
        ? "february"
        : month === 2
          ? "march"
          : month === 3
            ? "april"
            : month === 4
              ? "may"
              : month === 5
                ? "june"
                : month === 6
                  ? "july"
                  : month === 7
                    ? "august"
                    : month === 8
                      ? "september"
                      : month === 9
                        ? "october"
                        : month === 10
                          ? "november"
                          : month === 11
                            ? "december"
                            : "may",
  );
  useEffect(() => {
    if (availableMonths) {
      setSeriesData(availableMonths[0] ?? "april");
    }
  }, []);

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {},
    xaxis: {
      categories,
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: Month) => {
      popover.onClose();
      setSeriesData(newValue);
      if (onMonthChange) {
        switch (newValue) {
          case "january":
            onMonthChange(0);
            break;
          case "february":
            onMonthChange(1);
            break;
          case "march":
            onMonthChange(2);
            break;
          case "april":
            onMonthChange(3);
            break;
          case "may":
            onMonthChange(4);
            break;
          case "june":
            onMonthChange(5);
            break;
          case "july":
            onMonthChange(6);
            break;
          case "august":
            onMonthChange(7);
            break;
          case "september":
            onMonthChange(8);
            break;
          case "october":
            onMonthChange(9);
            break;
          case "november":
            onMonthChange(10);
            break;
          case "december":
            onMonthChange(11);
            break;
        }
      }
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
              {seriesData && seriesData[0]?.toString().toUpperCase()}
              {seriesData && seriesData.toString().substring(1)}

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

        {series.map((item) => (
          <Box key={item.month} sx={{ mt: 3, mx: 3 }}>
            {item.month.toLocaleLowerCase() === seriesData && (
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

      {availableMonths && !isLoadingMonths && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          sx={{ width: 140 }}
        >
          {availableMonths.map((month) => (
            <MenuItem
              key={month}
              selected={month === seriesData}
              onClick={() => handleChangeSeries(month)}
            >
              {month[0]?.toUpperCase()}
              {month.substring(1)}
            </MenuItem>
          ))}
        </CustomPopover>
      )}
    </>
  );
}
