import { describe, expect, it, vi } from "vitest";
import { eventRouter } from "../event";
import {
  type TRPCQueryProcedure,
  type TRPCMutationProcedure,
} from "@trpc/server";
import { type DecorateRouterRecord } from "@trpc/server/unstable-core-do-not-import";

const client: DecorateRouterRecord<{
  get: TRPCQueryProcedure<{
    input: number;
    output: {
      id: number;
      name: string;
      cron: string | null;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
    } | null;
  }>;
  list: TRPCQueryProcedure<{
    input: { limit?: number | undefined; offset?: number | undefined };
    output: {
      id: number;
      name: string;
      cron: string | null;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
    }[];
  }>;
  create: TRPCMutationProcedure<{
    input: { name: string; cron?: string | undefined };
    output: {
      id: number;
      name: string;
      cron: string | null;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
    };
  }>;
  update: TRPCMutationProcedure<{
    input: { id: number; name?: string | undefined; cron?: string | undefined };
    output: {
      id: number;
      name: string;
      cron: string | null;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
    };
  }>;
  delete: TRPCMutationProcedure<{
    input: number;
    output: {
      id: number;
      name: string;
      cron: string | null;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
    };
  }>;
}> = eventRouter.createCaller({
  session: {
    user: {
      id: "asdasfasd",
    },
    expires: "asdafsas",
  },
  db: {
    event: {
      findFirst: vi.fn(() => ({ id: 1 })),
      findMany: vi.fn(() => [{ id: 1 }, { id: 2 }]),
      create: vi.fn(() => ({ id: 1, name: "test", cron: "* * * * *" })),
      update: vi.fn(() => ({ id: 1, name: "test", cron: "" })),
      delete: vi.fn(() => ({ id: 1, name: "test", cron: "" })),
    },
  },
});

describe("eventRouter", () => {
  it("Should return an event with id 1", async () => {
    const response = await client.get(1);

    expect(response).toMatchObject({ id: 1 });
  });

  it("Should return a list of events", async () => {
    const response = await client.list({ limit: 10, offset: 0 });

    expect(response).toMatchObject([{ id: 1 }, { id: 2 }]);
  });

  it("Should create an event", async () => {
    const response = await client.create({ name: "test" });

    expect(response).toMatchObject({ id: 1, name: "test" });
    console.log(response);
  });

  it("Should create an event with cron", async () => {
    const response = await client.create({ name: "test", cron: "* * * * *" });

    expect(response).toMatchObject({ id: 1, name: "test", cron: "* * * * *" });
  });

  it("Should update an event", async () => {
    const response = await client.update({ id: 1, name: "test" });

    expect(response).toMatchObject({ id: 1, name: "test" });
  });
});
