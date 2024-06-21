import appRequest from "./server.test";
import { describe, expect, test } from "@jest/globals";

describe("Test app level routes", () => {
  test("Get / route", async () => {
    const res = await appRequest.get("/");
    expect(res.status).toEqual(200);
  });

  test("Get /health route", async () => {
    const res = await appRequest.get("/health");
    expect(res.status).toEqual(200);
  });

  test("Catch invalid routes", async () => {
    const res = await appRequest.get("/invalid");
    expect(res.status).toEqual(404);
  });
});
