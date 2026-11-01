import { describe, expect, it } from "vitest";
import {
  normalizeBrazilianPhone,
  onlyDigits,
  toVerificationCode,
} from "./phone";

describe("phone", () => {
  it("mantém apenas os dígitos", () => {
    expect(onlyDigits("(11) 98765-4321")).toBe("11987654321");
  });

  it("remove o código do país de telefones brasileiros", () => {
    expect(normalizeBrazilianPhone("+55 (11) 98765-4321")).toBe("11987654321");
    expect(normalizeBrazilianPhone("5511987654321")).toBe("11987654321");
  });

  it("preserva números que começam com 55 sem código do país", () => {
    expect(normalizeBrazilianPhone("55987654321")).toBe("55987654321");
  });

  it("limita o código de verificação a seis dígitos", () => {
    expect(toVerificationCode("12a3-4567")).toBe("123456");
  });
});
