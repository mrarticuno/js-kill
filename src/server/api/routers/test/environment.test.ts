import { beforeAll, describe, expect, it, vi } from "vitest";
import { environmentRouter } from "../environment";
import {
  type TRPCQueryProcedure,
  type TRPCMutationProcedure,
} from "@trpc/server";
import { type DecorateRouterRecord } from "@trpc/server/unstable-core-do-not-import";

let client: DecorateRouterRecord<{
  get: TRPCQueryProcedure<{
    input: number;
    output: {
      id: number;
      name: string;
      version: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  }>;
  list: TRPCQueryProcedure<{
    input: { limit?: number | undefined; offset?: number | undefined };
    output: {
      id: number;
      name: string;
      version: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }>;
  create: TRPCMutationProcedure<{
    input: { name: string; version: string };
    output: {
      id: number;
      name: string;
      version: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  update: TRPCMutationProcedure<{
    input: { name: string; version: string; id: number };
    output: {
      id: number;
      name: string;
      version: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  delete: TRPCMutationProcedure<{
    input: number;
    output: {
      id: number;
      name: string;
      version: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
}> | null = null;

beforeAll(() => {
  client = environmentRouter.createCaller({
    session: {
      user: {
        id: "asdasfasd",
      },
      expires: "asdafsas",
    },
    db: {
      environment: {
        findFirst: vi.fn(() => ({ id: 1 })),
        findMany: vi.fn(() => [{ id: 1 }, { id: 2 }]),
        create: vi.fn(() => ({ id: 1, name: "test", version: "1.0" })),
        update: vi.fn(() => ({ id: 1, name: "test", version: "1.0" })),
        delete: vi.fn(() => ({ id: 1, name: "test", version: "1.0" })),
      },
    },
  });
});

describe("environmentRouter", () => {
  it("Should return an environment with id 1", async () => {
    const response = await client?.get(1);

    expect(response).toMatchObject({ id: 1 });
  });

  it("Should return a list of environments", async () => {
    const response = await client?.list({ limit: 10, offset: 0 });

    expect(response).toMatchObject([{ id: 1 }, { id: 2 }]);
  });

  it("Should create an environment", async () => {
    const response = await client?.create({ name: "test", version: "1.0" });

    expect(response).toMatchObject({ id: 1, name: "test", version: "1.0" });
  });

  it("Should update an environment", async () => {
    const response = await client?.update({
      id: 1,
      name: "test",
      version: "1.0",
    });

    expect(response).toMatchObject({ id: 1, name: "test", version: "1.0" });
  });

  it("Should delete an environment", async () => {
    const response = await client?.delete(1);

    expect(response).toMatchObject({ id: 1, name: "test", version: "1.0" });
  });
});
