"use client";
import { Skeleton } from "@mui/material";

import { api } from "@/trpc/react";

import OverviewWidgetSummary from "../overview-widget-summary";

interface EnergyConsumptionWidgetProps {
  lastDays: number;
  UOM?: string;
}
const EnergyConsumptionWidget = ({
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
    failureReason: failureReasonECBD,
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
    !isLoading && !isErrorECBD && energyConsumptionByDays
      ? energyConsumptionByDays
      : [];

  console.log(totalEnergyLastNDays);

  return (
    <>
      {isLoading && <Skeleton sx={{ width: "100%", height: "100%" }} />}
      {!isLoading && (
        <OverviewWidgetSummary
          title={
            isError && failureReason
              ? failureReason.message
              : `Total Energy Delivered in the last ${lastDays} days`
          }
          percent={widgetPercent}
          UOM={UOM}
          total={widgetTotal}
          chart={{
            series: widgetSeries,
          }}
        />
      )}
    </>
  );
};

export default EnergyConsumptionWidget;
