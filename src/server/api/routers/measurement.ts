import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
});
