import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { runCode } from "../utils/sandbox";

export const executionRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx }) => {
    const execution = await ctx.db.execution.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return execution ?? null;
  }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const executions = await ctx.db.execution.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return executions;
    }),

  execute: protectedProcedure
    .input(
      z.object({
        functionId: z.number(),
        context: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const func = await ctx.db.function.findUnique({
        where: { id: input.functionId },
      });

      if (!func) {
        throw new Error("Function not found");
      }

      const result = await runCode(func.code);

      return ctx.db.execution.create({
        data: {
          context: input.context,
          log: JSON.stringify(result),
          Function: { connect: { id: input.functionId } },
        },
      });
    }),
});
