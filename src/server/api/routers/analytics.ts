import { TRPCError } from "@trpc/server";
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
type EnergyPerDay = {
  date: string;
  total_energy: number;
};
export type Month =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

// Function to map month numbers to month names
const monthNames: Month[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
export const analyticsRouter = createTRPCRouter({
  getLocationsAvgTemp: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      const results = await ctx.db.measurement.groupBy({
        by: ["location"],
        _avg: {
          t_amb: true, // assuming `t_amb` is the ambient temperature field
        },
        where: {
          datetime: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Formatiranje rezultata u željeni oblik
      const formattedResults = results.map((result) => ({
        location: result.location,
        avg_temp: result._avg.t_amb
          ? parseFloat(result._avg.t_amb.toFixed(2))
          : 0, // rounding to 2 decimal places
      }));
      return formattedResults;
    }),
});
