import { describe, expect, it } from "vitest";
import {
  isActiveAppointment,
  professionalStatusLabel,
} from "./professional-dashboard.utils";
import type { ProfessionalDashboardAppointment } from "./professional.service";

const withStatus = (status: string) =>
  ({ status }) as ProfessionalDashboardAppointment;

describe("professional dashboard utils", () => {
  it("traduz todos os status, inclusive não comparecimento", () => {
    expect(professionalStatusLabel("NO_SHOW")).toBe("Não compareceu");
    expect(professionalStatusLabel("IN_PROGRESS")).toBe("Em atendimento");
    expect(professionalStatusLabel("PENDING")).toBe("Pendente");
  });

  it("considera ativos apenas os agendamentos pendentes de atendimento", () => {
    expect(isActiveAppointment(withStatus("CONFIRMED"))).toBe(true);
    expect(isActiveAppointment(withStatus("NO_SHOW"))).toBe(false);
    expect(isActiveAppointment(withStatus("CANCELLED"))).toBe(false);
  });
});
