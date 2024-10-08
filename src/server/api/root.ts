import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { environmentRouter } from "./routers/environment";
import { eventRouter } from "./routers/event";
import { functionRouter } from "./routers/function";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  enviroment: environmentRouter,
  function: functionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
