import { describe, expect, it } from "vitest";
import { currency, initials } from "./format";

describe("format", () => {
  it("formata valores em reais", () => {
    expect(currency.format(1234.5).replace(/\s/g, " ")).toBe("R$ 1.234,50");
  });

  it("gera iniciais com no máximo duas letras", () => {
    expect(initials("  Ana Maria da Silva ")).toBe("AM");
    expect(initials("madonna")).toBe("M");
    expect(initials(" ")).toBe("");
  });
});
