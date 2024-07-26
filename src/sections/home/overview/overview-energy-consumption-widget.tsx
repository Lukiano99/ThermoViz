"use client";
import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { api } from "@/trpc/react";

import OverviewWidgetSummary from "./overview-widget-summary";

interface EnergyConsumptionWidgetProps {
  lastDays: number;
  UOM?: string;
}
const OverviewEnergyConsumptionWidget = ({
  lastDays,
  UOM,
}: EnergyConsumptionWidgetProps) => {
  const {
    data: totalEnergyLastNDays,
    isLoading,
    isError,
    failureReason,
  } = api.measurement.totalEnergyLastNDays.useQuery({ days: lastDays });
  const {
    data: energyConsumptionByDays,
    isLoading: isLoadingECBD,
    isError: isErrorECBD,
  } = api.measurement.energyConsumptionByDays.useQuery({ days: lastDays });

  const widgetTitle =
    isError && failureReason
      ? failureReason.message
      : `Total Energy Delivered in the last ${lastDays} days`;
  const widgetPercent =
    !isLoading && isError && failureReason
      ? 0
      : totalEnergyLastNDays
        ? totalEnergyLastNDays.percentageDifference
        : 0;
  const widgetTotal =
    !isLoading && isError && failureReason
      ? 0
      : totalEnergyLastNDays
        ? totalEnergyLastNDays.totalEnergyLastNDays
        : 0;

  const widgetSeries =
    !isLoadingECBD && !isErrorECBD && energyConsumptionByDays
      ? energyConsumptionByDays
      : [];

  const theme = useTheme();

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {(isLoading || isLoadingECBD) && (
        <Skeleton
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        />
      )}
      {!isLoading && totalEnergyLastNDays && (
        <OverviewWidgetSummary
          title={widgetTitle}
          percent={widgetPercent}
          UOM={UOM}
          total={widgetTotal}
          chart={{
            series: !isLoadingECBD || !isErrorECBD ? widgetSeries : [],
            colors:
              widgetPercent > 0
                ? [theme.palette.error.main, theme.palette.error.main]
                : widgetPercent < 0 && widgetPercent > -2
                  ? [theme.palette.warning.main, theme.palette.warning.main]
                  : widgetPercent < -2 && widgetPercent > -10
                    ? [theme.palette.info.main, theme.palette.info.main]
                    : widgetPercent < -10
                      ? [theme.palette.success.main, theme.palette.success.main]
                      : [],
          }}
          lastDays={lastDays}
        />
      )}
    </Box>
  );
};

export default OverviewEnergyConsumptionWidget;
