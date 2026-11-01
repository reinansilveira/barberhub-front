import { describe, expect, it } from "vitest";
import { resolveClientView } from "./client.nav";

describe("resolveClientView", () => {
  it("aceita apenas visões conhecidas", () => {
    expect(resolveClientView("conta")).toBe("conta");
    expect(resolveClientView("financeiro")).toBe("inicio");
    expect(resolveClientView()).toBe("inicio");
  });
});
