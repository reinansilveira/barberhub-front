import { describe, expect, it } from "vitest";
import { filterSuggestions } from "./topbar.utils";

describe("topbar utils", () => {
  it("filtra atalhos e serviços pelo texto digitado", () => {
    expect(filterSuggestions("financ", []).map((item) => item.label)).toEqual([
      "Financeiro",
    ]);
    expect(
      filterSuggestions("degradê", ["Corte degradê"]).map((item) => item.href),
    ).toEqual(["/dashboard?view=catalogo"]);
    expect(filterSuggestions("", ["A", "B"])).toHaveLength(6);
  });
});
