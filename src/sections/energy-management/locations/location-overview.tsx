import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Card, { type CardProps } from "@mui/material/Card";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { type ApexOptions } from "apexcharts";
import Chart, { useChart } from "src/components/chart";
import { fData } from "src/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  total: number;
  title: string;
  currentTemperature: number;
  averageTemperature: number;
  totalDailyEnergy: number;
  deltaT: number;
  status: string;
  data: {
    name: string;
    usedStorage: number;
    filesCount: number;
    icon: React.ReactNode;
  }[];
  chart: {
    colors?: string[];
    series: number;
    options?: ApexOptions;
  };
}

export default function LocationOverview({
  data,
  total,
  chart,
  title,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.info.main, theme.palette.info.dark],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    chart: {
      offsetY: -16,
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: 24,
        bottom: 24,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "56%",
        },
        dataLabels: {
          name: {
            offsetY: 8,
          },
          value: {
            offsetY: -40,
          },
          total: {
            // label: `Used of ${fData(total)} / 50GB`,
            label: `${fData(total)}/50GB`,
            color: theme.palette.text.disabled,
            fontSize: theme.typography.body2.fontSize as string,
            fontWeight: theme.typography.body2.fontWeight,
          },
        },
      },
    },
    fill: {
      // type: "gradient",
      // gradient: {
      //   colorStops: [
      //     { offset: 0, color: colors[0] ?? "green", opacity: 1 },
      //     { offset: 100, color: colors[1] ?? "green", opacity: 1 },
      //   ],
      // },
    },
    ...options,
  });

  return (
    <Card
      {...other}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          pt: 3,
        }}
      >
        {title}
      </Typography>

      <Chart
        dir="ltr"
        type="radialBar"
        series={[series]}
        options={chartOptions}
        width="100%"
        height={360}
      />

      <Stack spacing={3} sx={{ px: 3, pb: 5 }}>
        {data.map((category) => (
          <Stack
            key={category.name}
            spacing={2}
            direction="row"
            alignItems="center"
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}
            >
              {category.icon}
            </Box>

            <ListItemText
              primary={category.name}
              secondary={`${category.filesCount} files`}
              secondaryTypographyProps={{
                mt: 0.5,
                component: "span",
                typography: "caption",
                color: "text.disabled",
              }}
            />

            <Box sx={{ typography: "subtitle2" }}>
              {" "}
              {fData(category.usedStorage)}{" "}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
