import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const environmentRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx }) => {
    const environment = await ctx.db.environment.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return environment ?? null;
  }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const environments = await ctx.db.environment.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return environments;
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), version: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.environment.create({
        data: {
          name: input.name,
          version: input.version,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        version: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.environment.update({
        where: { id: input.id },
        data: {
          name: input.name,
          version: input.version,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.environment.delete({
        where: { id: input },
      });
    }),
});
