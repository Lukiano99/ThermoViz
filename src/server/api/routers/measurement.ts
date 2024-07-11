import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const measurementRouter = createTRPCRouter({
  helloPublic: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.users.findMany({ where: {} });
  }),
});
