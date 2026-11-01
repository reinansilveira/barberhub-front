import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

vi.mock("@/utils/date-utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/utils/date-utils")>()),
  todayInBrazil: () => "2026-11-02",
}));

const dayButton = (label: RegExp) =>
  screen.getByRole("button", { name: label });

describe("AvailabilityCalendar", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ availableDates: ["2026-11-10", "2026-11-12"] }),
      }),
    );
  });

  it("habilita só os dias disponíveis e marca o selecionado com modificadores BEM", async () => {
    render(
      <AvailabilityCalendar
        professionalId="professional-a"
        value="2026-11-12"
        onChange={vi.fn()}
      />,
    );

    const available = await screen.findByRole("button", {
      name: /10 de novembro/,
    });
    expect(available).toBeEnabled();
    expect(available).toHaveClass(
      "availability-calendar__day",
      "availability-calendar__day--available",
    );
    expect(dayButton(/12 de novembro/)).toHaveClass(
      "availability-calendar__day--selected",
    );
    expect(dayButton(/11 de novembro/)).toBeDisabled();
    expect(dayButton(/5 de dezembro/)).toHaveClass(
      "availability-calendar__day--outside-month",
    );
  });

  it("mantém a navegação de mês dentro do próprio calendário", () => {
    const { container } = render(
      <AvailabilityCalendar
        professionalId="professional-b"
        value="2026-11-12"
        onChange={vi.fn()}
      />,
    );

    const header = container.querySelector(".availability-calendar__header");
    expect(header?.closest(".availability-calendar")).not.toBeNull();
    expect(container.querySelector(".header")).toBeNull();
    expect(screen.getByRole("button", { name: "Mês anterior" })).toBeDisabled();
  });

  it("avisa a data escolhida", async () => {
    const onChange = vi.fn();
    render(
      <AvailabilityCalendar
        professionalId="professional-c"
        value="2026-11-02"
        onChange={onChange}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: /10 de novembro/ }),
    );

    expect(onChange).toHaveBeenCalledWith("2026-11-10");
  });
});
