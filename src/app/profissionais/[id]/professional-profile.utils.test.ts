import { describe, expect, it } from "vitest";
import {
  buildAvatarUrl,
  extractPortfolioImages,
  formatDateLabel,
  formatDuration,
  formatPrice,
} from "./professional-profile.utils";
import type { BookingServiceItem } from "./professional-profile.types";

describe("professional profile utils", () => {
  it("formata preço e trata valores ausentes", () => {
    expect(formatPrice("45.9").replace(/\s/g, " ")).toBe("R$ 45,90");
    expect(formatPrice(undefined).replace(/\s/g, " ")).toBe("R$ 0,00");
  });

  it("formata a duração em horas e minutos", () => {
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(60)).toBe("1 h");
    expect(formatDuration("90")).toBe("1 h 30 min");
    expect(formatDuration(-5)).toBe("0 min");
  });

  it("formata a data do dia sem deslocar o fuso", () => {
    expect(formatDateLabel("2026-11-02")).toBe("02 de nov.");
  });

  it("usa um avatar gerado quando o profissional não tem foto", () => {
    expect(buildAvatarUrl("https://foto.png", "Reinan")).toBe(
      "https://foto.png",
    );
    expect(buildAvatarUrl(undefined, "João Silva")).toContain(
      "name=Jo%C3%A3o%20Silva",
    );
  });

  it("extrai as imagens de portfólio respeitando o limite", () => {
    const services = ["a.png", undefined, "b.png", "c.png"].map(
      (image) => ({ service: { image } }) as BookingServiceItem,
    );

    expect(extractPortfolioImages(services, 2)).toEqual(["a.png", "b.png"]);
  });
});
