import { Box, Typography } from "@mui/material";
import Card, { type CardProps } from "@mui/material/Card";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { type ApexOptions } from "apexcharts";
import Chart, { useChart } from "src/components/chart";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  total: number;
  consumption: number;
  title: string;
  latestMeasurementTime: string;
  latestUpdateTime: string;

  data: {
    name: string;
    value: number;
    filesCount: number;
    icon: React.ReactNode;
    UOM?: string;
    description?: string;
  }[];
  chart: {
    colors?: string[];
    series: number;
    options?: ApexOptions;
  };
}

export default function LocationOverview({
  consumption,
  data,
  total,
  latestMeasurementTime,
  latestUpdateTime,
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
        top: 10,
        bottom: 10,
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
          size: "60%",
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
            label: `${consumption} / ${total.toFixed(2)} KWh`,
            color: theme.palette.text.disabled,
            fontSize: theme.typography.body2.fontSize as string,
            fontWeight: theme.typography.body2.fontWeight,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0] ?? "green", opacity: 1 },
          { offset: 100, color: colors[1] ?? "green", opacity: 1 },
        ],
      },
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
      <Stack
        sx={{
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          width: "70%",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            pt: 1,
          }}
        >
          Last measurement time:
        </Typography>
        <Typography
          variant="caption"
          sx={{
            pt: 1,
          }}
        >
          <strong>{latestMeasurementTime}</strong>
        </Typography>
      </Stack>
      <Stack
        sx={{
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          width: "70%",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            pt: 1,
          }}
        >
          Fetched:
        </Typography>
        <Typography
          variant="caption"
          sx={{
            pt: 1,
          }}
        >
          <strong>{latestUpdateTime}</strong>
        </Typography>
      </Stack>

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
            alignItems="start"
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
              secondary={`${category.description}`}
              primaryTypographyProps={{
                typography: "subtitle2",
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: "span",
                typography: "caption",
                color: "text.disabled",
              }}
            />

            <Box
              sx={{
                typography: "subtitle2",
                ml: 2,
                width: 1 / 3,
                display: "flex",
                justifyContent: "end",
              }}
            >
              {`${category.value} ${category.UOM ?? ""}`}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
