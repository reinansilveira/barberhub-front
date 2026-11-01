import { describe, expect, it } from "vitest";
import { isCancelled, isCompleted } from "./dashboard.utils";

describe("dashboard utils", () => {
  it("considera concluídos os status confirmados ou finalizados", () => {
    expect(isCompleted("COMPLETED")).toBe(true);
    expect(isCompleted("CONFIRMED")).toBe(true);
    expect(isCompleted("PENDING")).toBe(false);
  });

  it("identifica cancelamentos independente da origem", () => {
    expect(isCancelled("cancelled_by_client")).toBe(true);
    expect(isCancelled("COMPLETED")).toBe(false);
  });
});
