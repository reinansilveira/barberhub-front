import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getClientDashboard } from "@/services/client";
import { makeClientAppointment, makeClientDashboard } from "@/test/factories";
import {
  useClientDashboardData,
  useClientDashboardStore,
} from "./client-dashboard.store";

vi.mock("@/services/client", () => ({ getClientDashboard: vi.fn() }));

const fetchDashboard = vi.mocked(getClientDashboard);
const store = () => useClientDashboardStore.getState();

describe("client dashboard store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useClientDashboardStore.setState(useClientDashboardStore.getInitialState());
  });

  it("carrega os dados e encerra o carregamento", async () => {
    const data = makeClientDashboard();
    fetchDashboard.mockResolvedValue(data);

    await store().load();

    expect(store()).toMatchObject({ data, loading: false, error: "" });
  });

  it("guarda a mensagem de erro quando a API falha", async () => {
    fetchDashboard.mockRejectedValue(new Error("offline"));

    await store().load();

    expect(store()).toMatchObject({
      data: null,
      loading: false,
      error: "Não foi possível carregar sua conta.",
    });
  });

  it("ignora uma resposta antiga que chega depois de uma nova carga", async () => {
    let resolveFirst: (
      value: ReturnType<typeof makeClientDashboard>,
    ) => void = () => {};
    fetchDashboard
      .mockImplementationOnce(
        () => new Promise((resolve) => (resolveFirst = resolve)),
      )
      .mockResolvedValueOnce(makeClientDashboard({ appointments: [] }));

    const firstLoad = store().load();
    await store().load();
    resolveFirst(makeClientDashboard());
    await firstLoad;

    expect(store().data?.appointments).toEqual([]);
  });

  it("atualiza cliente e agendamento sem perder o resto dos dados", () => {
    useClientDashboardStore.setState({ data: makeClientDashboard() });

    store().updateClient({ name: "Maria Lima" });
    store().updateAppointment({
      id: "client-appointment-1",
      status: "CANCELLED",
    });

    expect(store().data?.client).toMatchObject({
      name: "Maria Lima",
      email: "maria@email.com",
    });
    expect(store().data?.appointments[0]).toMatchObject({
      status: "CANCELLED",
      service: makeClientAppointment().service,
    });
  });

  it("mantém o estado quando ainda não há dados", () => {
    store().updateClient({ name: "Ninguém" });
    expect(store().data).toBeNull();
  });

  it("exige dados carregados para os componentes da conta", () => {
    expect(() => renderHook(() => useClientDashboardData())).toThrow(
      /depois que o painel carregar/,
    );
  });
});
