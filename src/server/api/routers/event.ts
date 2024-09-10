import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx }) => {
    const event = await ctx.db.event.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return event ?? null;
  }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.event.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return events;
    }),

  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), cron: z.string().min(1).optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.create({
        data: {
          name: input.name,
          cron: input.cron,
          executedBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        cron: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.update({
        where: { id: input.id },
        data: {
          name: input.name,
          cron: input.cron,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.delete({ where: { id: input } });
    }),
});
