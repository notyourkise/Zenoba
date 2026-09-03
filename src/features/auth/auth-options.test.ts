import { describe, expect, it } from "vitest";
import {
  buildAuthProviders,
  isGoogleAuthConfigured,
} from "@/features/auth/auth";

describe("authentication provider configuration", () => {
  it.each([
    [{}, false],
    [{ GOOGLE_CLIENT_ID: "client-id" }, false],
    [{ GOOGLE_CLIENT_SECRET: "client-secret" }, false],
    [
      {
        GOOGLE_CLIENT_ID: "client-id",
        GOOGLE_CLIENT_SECRET: "client-secret",
      },
      true,
    ],
  ] as const)("reports Google availability from a complete credential pair", (env, expected) => {
    expect(isGoogleAuthConfigured(env)).toBe(expected);
  });

  it("always includes credentials and adds Google only when configured", () => {
    expect(buildAuthProviders({}).map((provider) => provider.id)).toEqual([
      "credentials",
    ]);
    expect(
      buildAuthProviders({
        GOOGLE_CLIENT_ID: "client-id",
        GOOGLE_CLIENT_SECRET: "client-secret",
      }).map((provider) => provider.id),
    ).toEqual(["credentials", "google"]);
  });
});
