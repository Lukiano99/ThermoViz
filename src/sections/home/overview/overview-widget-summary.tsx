import Box from "@mui/material/Box";
import Card, { type CardProps } from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import { type ApexOptions } from "apexcharts";
import Chart from "src/components/chart";
import Iconify from "src/components/iconify";
import { fNumber, fPercent } from "src/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  percent: number;
  UOM?: string;
  lastDays?: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function OverviewWidgetSummary({
  title,
  percent,
  UOM,
  total,
  lastDays,
  chart,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "68%",
        borderRadius: 1.5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => "",
        },
      },
      marker: { show: false },
    },
    ...options,
  };

  const renderTrending = (
    <Box sx={{ gap: 0.5, display: "flex", alignItems: "center" }}>
      <Iconify
        width={24}
        icon={
          percent < 0
            ? "solar:double-alt-arrow-down-bold-duotone"
            : "solar:double-alt-arrow-up-bold-duotone"
        }
        sx={{
          flexShrink: 0,
          color: "error.main",
          ...(percent < 0 && { color: "success.main" }),
        }}
      />

      <Box component="span" sx={{ typography: "subtitle2" }}>
        {percent > 0 && "+"}
        {fPercent(percent)}
      </Box>
      <Box
        component="span"
        sx={{ typography: "body2", color: "text.secondary" }}
      >
        last {lastDays} days
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{ display: "flex", alignItems: "center", p: 3, ...sx }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: "subtitle2" }}>{title}</Box>
        <Box
          sx={{
            mt: 1.5,
            mb: 1,
            typography: "h3",
          }}
        >
          {fNumber(total)}
          {total === 0 && "No Data"}
          {UOM && (
            <span
              style={{
                marginLeft: 10,
                fontSize: 24,
                fontWeight: 2,
              }}
            >
              {total !== 0 && UOM}
            </span>
          )}
        </Box>
        {renderTrending}
      </Box>

      <Chart
        dir="ltr"
        type="bar"
        series={[{ data: series }]}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={chartOptions}
        width={60}
        height={36}
      />
    </Card>
  );
}
