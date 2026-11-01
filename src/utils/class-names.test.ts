import { describe, expect, it } from "vitest";
import { cn } from "./class-names";

describe("cn", () => {
  it("junta apenas as classes verdadeiras", () => {
    expect(cn("card", false, "card--active", null, undefined, "")).toBe(
      "card card--active",
    );
  });

  it("retorna string vazia sem classes", () => {
    expect(cn(false, null)).toBe("");
  });
});
