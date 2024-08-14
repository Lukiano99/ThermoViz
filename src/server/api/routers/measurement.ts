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
export const measurementRouter = createTRPCRouter({
  // // Vraća sve merenja
  // list: protectedProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.measurement.findMany();
  // }),

  // // Vraća merenja za određenu lokaciju
  // getByLocation: protectedProcedure
  //   .input(z.object({ location: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     return await ctx.db.measurement.findMany({
  //       where: { location: input.location },
  //     });
  //   }),

  // // Vraća merenja za određeni vremenski interval
  // getByDateRange: protectedProcedure
  //   .input(
  //     z.object({
  //       startDate: z.string(),
  //       endDate: z.string(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     return await ctx.db.measurement.findMany({
  //       where: {
  //         datetime: {
  //           gte: new Date(input.startDate),
  //           lte: new Date(input.endDate),
  //         },
  //       },
  //     });
  //   }),

  // // Vraća merenja za određeni raspon temperature
  // getByTemperatureRange: protectedProcedure
  //   .input(
  //     z.object({
  //       minTemperature: z.number(),
  //       maxTemperature: z.number(),
  //       temperatureField: z.enum([
  //         "t_amb",
  //         "t_ref",
  //         "t_sup_prim",
  //         "t_ret_prim",
  //         "t_sup_sec",
  //         "t_ret_sec",
  //       ]),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     return await ctx.db.measurement.findMany({
  //       where: {
  //         [input.temperatureField]: {
  //           gte: input.minTemperature,
  //           lte: input.maxTemperature,
  //         },
  //       },
  //     });
  //   }),
  // // Prosečne temperature po danu
  // getAverageTemperatureByDay: protectedProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.measurement.groupBy({
  //     by: ["datetime"],
  //     _avg: {
  //       t_amb: true,
  //       t_ref: true,
  //       t_sup_prim: true,
  //       t_ret_prim: true,
  //       t_sup_sec: true,
  //       t_ret_sec: true,
  //     },
  //     orderBy: {
  //       datetime: "asc",
  //     },
  //   });
  // }),

  // // Prosečna potrošnja energije po danu
  // getAverageEnergyConsumptionByDay: protectedProcedure.query(
  //   async ({ ctx }) => {
  //     return await ctx.db.measurement.groupBy({
  //       by: ["datetime"],
  //       _avg: {
  //         e: true,
  //         pe: true,
  //       },
  //       orderBy: {
  //         datetime: "asc",
  //       },
  //     });
  //   },
  // ),

  // // Prosečne temperature po lokaciji
  // getAverageTemperatureByLocation: protectedProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.measurement.groupBy({
  //     by: ["location"],
  //     _avg: {
  //       t_amb: true,
  //       t_ref: true,
  //       t_sup_prim: true,
  //       t_ret_prim: true,
  //       t_sup_sec: true,
  //       t_ret_sec: true,
  //     },
  //   });
  // }),

  // // Dnevni temperaturni rasponi
  // getDailyTemperatureRange: protectedProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.measurement.groupBy({
  //     by: ["datetime"],
  //     _min: {
  //       t_amb: true,
  //       t_ref: true,
  //       t_sup_prim: true,
  //       t_ret_prim: true,
  //       t_sup_sec: true,
  //       t_ret_sec: true,
  //     },
  //     _max: {
  //       t_amb: true,
  //       t_ref: true,
  //       t_sup_prim: true,
  //       t_ret_prim: true,
  //       t_sup_sec: true,
  //       t_ret_sec: true,
  //     },
  //     orderBy: {
  //       datetime: "asc",
  //     },
  //   });
  // }),
  totalEnergyLastNDays: protectedProcedure
    .input(z.object({ days: z.number().positive() })) // Input validation
    .query(async ({ input, ctx }) => {
      const { days } = input;
      // const today = startOfDay(new Date());
      const today = startOfDay(new Date(2024, 4, 20));
      const nDaysAgo = subDays(today, days);
      const nDaysBeforeThat = subDays(today, 2 * days);

      const distinctDatesCountObject = await ctx.db.$queryRaw<
        {
          distinct_dates_count: number;
        }[]
      >`
      SELECT COUNT(DISTINCT DATE_TRUNC('day', datetime)) AS distinct_dates_count
      FROM "Measurement"
      WHERE datetime >= ${nDaysAgo} AND datetime < ${today};
    `;
      if (!distinctDatesCountObject[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Distinct Dates Count did not return properly value`,
        });
      }
      const distinctDatesCount = Number(
        distinctDatesCountObject[0].distinct_dates_count,
      );

      if (distinctDatesCount < input.days) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Data for some days in the last ${days} days is missing`,
        });
      }
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
  totalLocationsMonitored: protectedProcedure.query(async ({ ctx }) => {
    // Grupisanje po polju location i brojanje različitih lokacija
    const result = await ctx.db.measurement.groupBy({
      by: ["location"],
      _count: {
        location: true,
      },
    });

    // Broj različitih lokacija je dužina rezultujućeg niza
    const distinctLocationsCount = result.length;

    return distinctLocationsCount;
  }),
  averageAmbientTemperature: protectedProcedure
    .input(
      z.object({
        nDaysAgo: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const today = startOfDay(new Date(2024, 4, 20));
      // const today = startOfDay(new Date());

      const nDaysAgo = subDays(today, input.nDaysAgo);
      const twoNDaysAgo = subDays(today, 2 * input.nDaysAgo);

      // Prosecna temperatura za proteklih N dana
      const lastNDaysAvgTemp = await ctx.db.measurement.aggregate({
        _avg: {
          t_amb: true,
        },

        where: {
          datetime: {
            gte: nDaysAgo,
            lt: today,
          },
        },
      });

      // Niz vrednosti temperatura za proteklih N dana
      const lastNDaysTemperatures: {
        date: Date;
        avg_temp: number;
      }[] = await ctx.db.$queryRaw<
        {
          date: Date;
          avg_temp: number;
        }[]
      >`
      SELECT DATE(datetime) as date, ROUND(AVG(t_amb)::numeric, 2) as avg_temp
      FROM "Measurement"
      WHERE datetime >= ${nDaysAgo} AND datetime < ${today}
      GROUP BY DATE(datetime)
      ORDER BY date ASC;
    `;

      // Prosecna temperatura za prethodnih 2*N dana (od nDaysAgo do twoNDaysAgo)
      const previousTwoNDaysAvgTemp = await ctx.db.measurement.aggregate({
        _avg: {
          t_amb: true,
        },
        where: {
          datetime: {
            gte: twoNDaysAgo,
            lt: nDaysAgo,
          },
        },
      });

      const lastNDaysAverage = Number(
        (lastNDaysAvgTemp._avg.t_amb ?? 0).toFixed(2),
      );
      const previousTwoNDaysAverage = previousTwoNDaysAvgTemp._avg.t_amb ?? 0;

      // Izracunavanje procentne razlike
      let percentageDifference = 0;
      if (previousTwoNDaysAverage !== 0) {
        percentageDifference =
          ((lastNDaysAverage - previousTwoNDaysAverage) /
            previousTwoNDaysAverage) *
          100;
      }

      // Formatiranje rezultata za niz temperatura
      const temperaturesArray = lastNDaysTemperatures.map(
        (entry) => entry.avg_temp ?? 0,
      );

      return {
        averageTemperatureLastNDays: lastNDaysAverage,
        temperaturesArray: temperaturesArray,
        percentageDifference: percentageDifference,
      };
    }),
  // Ukupna potrošnja energije po lokaciji
  getTotalEnergyConsumptionByLocation: protectedProcedure.query(
    async ({ ctx }) => {
      const totalEnergyConsumptionByLocation = await ctx.db.measurement.groupBy(
        {
          by: ["location"],
          _sum: {
            e: true,
            // pe: true,
          },
        },
      );

      // Transformacija podataka
      const transformedData = totalEnergyConsumptionByLocation.map((item) => ({
        location: item.location,
        totalEnergyConsumptionByLocation: Number(
          ((item._sum.e ?? 0) / 1000).toFixed(2),
        ),
      }));

      // Izračunavanje ukupne potrošnje energije
      const totalEnergyConsumption = Number(
        (
          transformedData.reduce(
            (acc, curr) => acc + curr.totalEnergyConsumptionByLocation,
            0,
          ) / 1000
        ).toFixed(2),
      ); // MWh

      return {
        totalEnergyConsumption,
        data: transformedData,
      };
    },
  ),

  getMonthTemperatureData: protectedProcedure
    .input(
      z.object({
        month: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { month } = input;

      // Map month name to month index
      const monthMap: Record<string, number> = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const monthIndex = monthMap[month.toLowerCase()];

      if (monthIndex === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid month name provided: ${month}`,
        });
      }

      // za N meseca unazad
      const nMonthsAgo = 0;
      // const currentDate = new Date();
      const currentDate = startOfDay(new Date(2024, 4, 24));

      const currentYear = currentDate.getFullYear();
      // const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
      const currentMonth = monthIndex;

      // const startOfCurrentMonth = new Date(
      //   currentYear,
      //   currentMonth - nMonthsAgo,
      //   2,
      // );

      const startOfCurrentMonth = startOfMonth(
        new Date(currentYear, currentMonth - nMonthsAgo + 1),
      );
      startOfCurrentMonth.setUTCDate(1);
      startOfCurrentMonth.setUTCHours(0, 0, 0, 0);

      const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 1);

      const monthTemperatureData: {
        month: Month;
        day: Date;
        average_t_sup_prim: number;
        average_t_ret_prim: number;
      }[] = await ctx.db.$queryRaw`
    SELECT
    LOWER(TRIM(TO_CHAR(DATE_TRUNC('day', datetime), 'Month'))) AS month,
    DATE_TRUNC('day', datetime) AS day,
    ROUND(AVG(t_sup_prim)::numeric, 2) AS average_t_sup_prim,
    ROUND(AVG(t_ret_prim)::numeric, 2) AS average_t_ret_prim
    FROM
    "Measurement"
    WHERE
      datetime >= ${startOfCurrentMonth} AND datetime <= ${endOfCurrentMonth}
    GROUP BY
    day
    ORDER BY
    day;
    `;
      if (!monthTemperatureData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Month temperature data is missing. Something went wrong`,
        });
      }

      return monthTemperatureData;
    }),
  // Vraća najnovija merenja
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.measurement.findMany({
      orderBy: {
        datetime: "desc",
      },
      select: {
        datetime: true,
        location: true,
        e: true,
        pe: true,
      },
      take: 10, // Vraća 10 najnovijih merenja
    });
    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Recent data is missing`,
      });
    }
    return data.map((record) => ({
      date: record.datetime.toLocaleDateString(),
      time: record.datetime.toLocaleTimeString(),
      location: record.location,
      energy: record.e,
      power: record.pe,
    }));
  }),
  // Prosečne temperature po lokaciji za danas
  getAverageTemperatureByLocation: protectedProcedure.query(async ({ ctx }) => {
    // const today = startOfDay(new Date());
    const today = startOfDay(new Date(2024, 4, 20));
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const data = await ctx.db.measurement.groupBy({
      by: ["location"],
      where: {
        datetime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _avg: {
        t_amb: true,
        t_ref: true,
        t_sup_prim: true,
        t_ret_prim: true,
        t_sup_sec: true,
        t_ret_sec: true,
        e: true,
      },
      _sum: {
        e: true,
      },
    });

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Average temperatures by location data is missing`,
      });
    }

    const totalEnergy = await ctx.db.measurement.aggregate({
      _sum: {
        e: true,
      },
      where: {
        datetime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    // formating
    const averageTemperatureByLocation = data.map((record) => ({
      ...record,
      _avg: {
        ...record._avg,
        t_amb: Number(record._avg.t_amb?.toFixed(2) ?? 0),
        t_ref: Number(record._avg.t_ref?.toFixed(2) ?? 0),
        t_sup_prim: Number(record._avg.t_sup_prim?.toFixed(2) ?? 0),
        t_sup_sec: Number(record._avg.t_sup_sec?.toFixed(2) ?? 0),
        t_ret_prim: Number(record._avg.t_ret_prim?.toFixed(2) ?? 0),
        t_ret_sec: Number(record._avg.t_ret_sec?.toFixed(2) ?? 0),
      },
      _sum: {
        e: Number(record._sum.e?.toFixed(2) ?? 0),
      },
      totalEnergy: Number(totalEnergy._sum.e?.toFixed(2) ?? 0),
    }));

    return averageTemperatureByLocation;
  }),
  getDistinctMonths: protectedProcedure.query(async ({ ctx }) => {
    const distinctMonths = await ctx.db.measurement.findMany({
      select: {
        datetime: true,
      },
      distinct: ["datetime"],
      orderBy: {
        datetime: "asc",
      },
    });

    if (!distinctMonths) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No distinct months found in the database.`,
      });
    }

    const formattedMonths = Array.from(
      new Set(
        distinctMonths.map((record) => {
          const date = new Date(record.datetime);
          const month = date.getMonth(); // getMonth returns 0-11
          return monthNames[month];
        }),
      ),
    );

    return formattedMonths as Month[];
  }),
  getEnergyAndAmbientTemperatureData: protectedProcedure
    .input(
      z.object({
        month: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { month } = input;

      // Map month name to month index
      const monthMap: Record<string, number> = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const monthIndex = monthMap[month.toLowerCase()];

      if (monthIndex === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid month name provided: ${month}`,
        });
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const startOfSelectedMonth = startOfMonth(
        new Date(currentYear, monthIndex + 1),
      );
      startOfSelectedMonth.setUTCDate(1);
      startOfSelectedMonth.setUTCHours(0, 0, 0, 0);
      const endOfSelectedMonth = endOfMonth(new Date(currentYear, monthIndex));
      const energyAndAmbientTemperatureData: {
        energy: number;
        t_amb: number;
      }[] = await ctx.db.$queryRaw`SELECT
    ROUND((SUM(e)::numeric)/1000, 2) AS energy,
    ROUND(AVG(t_amb)::numeric, 2) AS t_amb,
    DATE_TRUNC('day', datetime) AS day    
  FROM
    "Measurement"
  WHERE
    datetime >= ${startOfSelectedMonth} AND datetime <= ${endOfSelectedMonth}
  GROUP BY
    DATE_TRUNC('day', datetime)
  ORDER BY
    DATE_TRUNC('day', datetime);`;

      if (!energyAndAmbientTemperatureData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Energy and ambient temperature data is missing for the month of ${month}.`,
        });
      }
      return energyAndAmbientTemperatureData;
    }),
});
