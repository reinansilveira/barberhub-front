import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress, ProgressLabel, ProgressValue } from "./progress";

describe("Progress", () => {
  it("limita o valor à faixa acessível de 0 a 100", () => {
    render(<Progress value={145} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("renderiza metadados e mantém a classe adicional", () => {
    render(
      <Progress className="dashboard-progress" value={42}>
        <ProgressLabel>Ocupação</ProgressLabel>
        <ProgressValue>{() => "42%"}</ProgressValue>
      </Progress>,
    );

    expect(screen.getByText("Ocupação")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar").parentElement).toHaveClass(
      "dashboard-progress",
    );
  });
});
