import { describe, expect, it } from "vitest";
import { makePayment } from "@/test/factories";
import { buildFinancialReportCsv } from "./financial-report";

describe("buildFinancialReportCsv", () => {
  it("gera o CSV com cabeçalho, separador ponto e vírgula e valor em reais", () => {
    const csv = buildFinancialReportCsv([
      makePayment({
        id: "pay-1",
        finalAmount: "45.5",
        method: "PIX",
        appointment: {
          id: "a1",
          service: { name: 'Corte "premium"' },
          professional: { user: { name: "Reinan" } },
        },
      }),
    ]);

    const [header, row] = csv.split("\r\n");
    expect(header).toBe(
      '"ID";"Data";"Serviço";"Profissional";"Forma de pagamento";"Status";"Valor (R$)"',
    );
    expect(row).toBe(
      '"pay-1";"01/11/2026";"Corte ""premium""";"Reinan";"PIX";"PAID";"45,50"',
    );
  });

  it("usa a data de criação quando o pagamento ainda não foi pago", () => {
    const csv = buildFinancialReportCsv([
      makePayment({
        paidAt: null,
        createdAt: "2026-10-15T12:00:00.000Z",
        status: "PENDING",
      }),
    ]);

    expect(csv.split("\r\n")[1]).toContain('"15/10/2026"');
  });
});
