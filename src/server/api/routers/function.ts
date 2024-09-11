import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const functionRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx }) => {
    const func = await ctx.db.function.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return func ?? null;
  }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const functions = await ctx.db.function.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return functions;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        timeout: z.number().default(3),
        environmentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.function.create({
        data: {
          name: input.name,
          code: input.code,
          timeout: input.timeout,
          environment: {
            connect: { id: input.environmentId },
          },
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        code: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.function.update({
        where: { id: input.id },
        data: {
          name: input.name,
          code: input.code,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.function.delete({
        where: { id: input },
      });
    }),
});
