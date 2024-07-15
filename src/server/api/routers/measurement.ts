import { TRPCError } from "@trpc/server";
import { format, startOfDay, subDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
type EnergyPerDay = {
  date: string;
  total_energy: number;
};
type RecordCounts = {
  distinct_dates_count: number;
};
export const measurementRouter = createTRPCRouter({
  // Vraća sve merenja
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.measurement.findMany();
  }),

  // Vraća merenja za određenu lokaciju
  getByLocation: protectedProcedure
    .input(z.object({ location: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.measurement.findMany({
        where: { location: input.location },
      });
    }),

  // Vraća merenja za određeni vremenski interval
  getByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.measurement.findMany({
        where: {
          datetime: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
      });
    }),

  // Vraća najnovija merenja
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.measurement.findMany({
      orderBy: {
        datetime: "desc",
      },
      take: 10, // Vraća 10 najnovijih merenja
    });
  }),

  // Vraća merenja za određeni raspon temperature
  getByTemperatureRange: protectedProcedure
    .input(
      z.object({
        minTemperature: z.number(),
        maxTemperature: z.number(),
        temperatureField: z.enum([
          "t_amb",
          "t_ref",
          "t_sup_prim",
          "t_ret_prim",
          "t_sup_sec",
          "t_ret_sec",
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.measurement.findMany({
        where: {
          [input.temperatureField]: {
            gte: input.minTemperature,
            lte: input.maxTemperature,
          },
        },
      });
    }),
  // Prosečne temperature po danu
  getAverageTemperatureByDay: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.measurement.groupBy({
      by: ["datetime"],
      _avg: {
        t_amb: true,
        t_ref: true,
        t_sup_prim: true,
        t_ret_prim: true,
        t_sup_sec: true,
        t_ret_sec: true,
      },
      orderBy: {
        datetime: "asc",
      },
    });
  }),

  // Prosečna potrošnja energije po danu
  getAverageEnergyConsumptionByDay: protectedProcedure.query(
    async ({ ctx }) => {
      return await ctx.db.measurement.groupBy({
        by: ["datetime"],
        _avg: {
          e: true,
          pe: true,
        },
        orderBy: {
          datetime: "asc",
        },
      });
    },
  ),

  // Prosečne temperature po lokaciji
  getAverageTemperatureByLocation: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.measurement.groupBy({
      by: ["location"],
      _avg: {
        t_amb: true,
        t_ref: true,
        t_sup_prim: true,
        t_ret_prim: true,
        t_sup_sec: true,
        t_ret_sec: true,
      },
    });
  }),

  // Ukupna potrošnja energije po lokaciji
  getTotalEnergyConsumptionByLocation: protectedProcedure.query(
    async ({ ctx }) => {
      return await ctx.db.measurement.groupBy({
        by: ["location"],
        _sum: {
          e: true,
          pe: true,
        },
      });
    },
  ),

  // Dnevni temperaturni rasponi
  getDailyTemperatureRange: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.measurement.groupBy({
      by: ["datetime"],
      _min: {
        t_amb: true,
        t_ref: true,
        t_sup_prim: true,
        t_ret_prim: true,
        t_sup_sec: true,
        t_ret_sec: true,
      },
      _max: {
        t_amb: true,
        t_ref: true,
        t_sup_prim: true,
        t_ret_prim: true,
        t_sup_sec: true,
        t_ret_sec: true,
      },
      orderBy: {
        datetime: "asc",
      },
    });
  }),
  totalEnergyLastNDays: protectedProcedure
    .input(z.object({ days: z.number().positive() })) // Input validation
    .query(async ({ input, ctx }) => {
      const { days } = input;
      // const today = startOfDay(new Date());
      const today = startOfDay(new Date(2024, 4, 20));
      const nDaysAgo = subDays(today, days);
      const nDaysBeforeThat = subDays(today, 2 * days);

      const distinctDatesCount = await ctx.db.$queryRaw<RecordCounts[]>`
      SELECT COUNT(DISTINCT DATE_TRUNC('day', datetime)) AS distinct_dates_count
      FROM "Measurement"
      WHERE datetime >= ${nDaysAgo} AND datetime < ${today};
    `;
      console.log(distinctDatesCount);
      // if (distinctDatesCount < input.days) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: `Data for some days in the last ${days} days is missing.`,
      //   });
      // }
      // Energy for the last N days
      const lastNDaysEnergy = await ctx.db.measurement.aggregate({
        _sum: {
          e: true,
        },
        where: {
          datetime: {
            gte: nDaysAgo,
            lt: today,
          },
        },
      });

      // Energy for the previous N days
      const previousNDaysEnergy = await ctx.db.measurement.aggregate({
        _sum: {
          e: true,
        },
        where: {
          datetime: {
            gte: nDaysBeforeThat,
            lt: nDaysAgo,
          },
        },
      });

      let lastNDaysTotal: number = lastNDaysEnergy._sum.e ?? 0;
      const previousNDaysTotal = previousNDaysEnergy._sum.e ?? 0;

      // Calculate the percentage difference
      let percentageDifference = 0;
      if (previousNDaysTotal !== 0) {
        percentageDifference =
          ((lastNDaysTotal - previousNDaysTotal) / previousNDaysTotal) * 100;
      }
      lastNDaysTotal = lastNDaysTotal / 1000;
      return {
        totalEnergyLastNDays: lastNDaysTotal,
        percentageDifference: percentageDifference,
      };
    }),

  energyConsumptionByDays: protectedProcedure
    .input(z.object({ days: z.number().positive() })) // Input validation
    .query(async ({ ctx, input }) => {
      const { days } = input;
      // const today = startOfDay(new Date());
      const today = startOfDay(new Date(2024, 4, 24));

      const startDate = format(subDays(today, days), "yyyy-MM-dd"); // Subtrahujemo 1 jer uključujemo i danas
      const endDate = format(today, "yyyy-MM-dd"); // Kraj intervala (danas)

      console.log({ startDate });
      console.log({ endDate });

      // Upit za računanje potrošnje energije po danima
      const results: EnergyPerDay[] = await ctx.db.$queryRawUnsafe<
        EnergyPerDay[]
      >(`
        SELECT DATE(datetime) as date, SUM(e) as total_energy
        FROM "Measurement"
        WHERE datetime >=  '${startDate}' AND datetime <= '${endDate}'
        GROUP BY DATE(datetime)
        ORDER BY date ASC;
        `);

      console.log({ results });

      if (!results) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Data for some days in the last ${days} days is missing.`,
        });
      }

      const totalEnergies = results.map(
        (result: EnergyPerDay) => result.total_energy ?? 0,
      );
      return totalEnergies;
    }),
});
