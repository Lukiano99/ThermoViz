import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { abs } from "stylis";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const locationsRouter = createTRPCRouter({
  getLocationStats: protectedProcedure
    // .input(
    //   z.object({
    //     startDate: z.date(),
    //     endDate: z.date(),
    //   }),
    // )
    .query(async ({ ctx }) => {
      // const todayStart = format(new Date(), "yyyy-MM-dd 00:00:00");
      // const todayEnd = format(new Date(), "yyyy-MM-dd 23:59:59");
      const todayStart = format(new Date("2024-04-28"), "yyyy-MM-dd 00:00:00");
      const todayEnd = format(new Date("2024-04-28"), "yyyy-MM-dd 23:59:59");

      const results = await ctx.db.measurement.groupBy({
        by: ["location"],
        where: {
          datetime: {
            gte: new Date(todayStart),
            lte: new Date(todayEnd),
          },
        },
        _avg: {
          t_amb: true,
        },
        _sum: {
          e: true,
        },
        _max: {
          datetime: true,
        },
      });
      if (!results) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Results doesn't exist`,
        });
      }

      const locationStats = await Promise.all(
        results.map(async (result) => {
          const currentMeasurement = await ctx.db.measurement.findFirst({
            where: {
              location: result.location,
              datetime: {
                gte: new Date(todayStart),
                lte: new Date(todayEnd),
              },
            },
            orderBy: {
              datetime: "desc",
            },
          });

          if (!currentMeasurement) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Current measurement doesn't exist`,
            });
          }
          const tempDifference = Number(
            abs(
              currentMeasurement?.t_sup_prim - currentMeasurement?.t_ret_prim,
            ).toFixed(2),
          );

          return {
            location: result.location,
            currentTemp: currentMeasurement?.t_amb ?? null,
            avgDailyTemp: Number(result._avg.t_amb?.toFixed(2)),
            totalDailyEnergy: Number(
              (Number(result._sum.e ?? null) / 1000).toFixed(2),
            ),
            tempDifference: tempDifference ?? null,
            fetchingTime: format(new Date(), "Pp"),
            latestMeasurementTime:
              format(new Date(result._max.datetime ?? ""), "Pp") ?? null,
          };
        }),
      );

      return locationStats;
    }),
});
