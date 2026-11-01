import { create } from "zustand";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  getClientDashboard,
  type ClientDashboardAppointment,
  type ClientDashboardData,
  type ClientResponseDto,
} from "@/services/client";

type ClientDashboardState = {
  data: ClientDashboardData | null;
  loading: boolean;
  error: string;
  reschedulingAppointment: ClientDashboardAppointment | null;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
  updateClient: (client: Partial<ClientResponseDto>) => void;
  updateAppointment: (
    appointment: Pick<ClientDashboardAppointment, "id"> &
      Partial<ClientDashboardAppointment>,
  ) => void;
  setReschedulingAppointment: (
    appointment: ClientDashboardAppointment | null,
  ) => void;
};

let latestRequest = 0;

export const useClientDashboardStore = create<ClientDashboardState>()(
  (set) => ({
    data: null,
    loading: true,
    error: "",
    reschedulingAppointment: null,

    load: async () => {
      const request = ++latestRequest;
      set({ data: null, loading: true, error: "" });
      try {
        const data = await getClientDashboard();
        if (request === latestRequest) set({ data });
      } catch (error) {
        if (request === latestRequest) {
          set({
            error: apiErrorMessage(
              error,
              "Não foi possível carregar sua conta.",
            ),
          });
        }
      } finally {
        if (request === latestRequest) set({ loading: false });
      }
    },

    refresh: async () => {
      try {
        set({ data: await getClientDashboard(), error: "" });
      } catch (error) {
        set({
          error: apiErrorMessage(
            error,
            "Não foi possível atualizar sua conta.",
          ),
        });
      }
    },

    updateClient: (client) =>
      set((state) =>
        state.data
          ? {
              data: {
                ...state.data,
                client: { ...state.data.client, ...client },
              },
            }
          : state,
      ),

    updateAppointment: (appointment) =>
      set((state) =>
        state.data
          ? {
              data: {
                ...state.data,
                appointments: state.data.appointments.map((current) =>
                  current.id === appointment.id
                    ? { ...current, ...appointment }
                    : current,
                ),
              },
            }
          : state,
      ),

    setReschedulingAppointment: (appointment) =>
      set({ reschedulingAppointment: appointment }),
  }),
);

export const useClientDashboardData = () => {
  const data = useClientDashboardStore((state) => state.data);
  if (!data) {
    throw new Error(
      "useClientDashboardData deve ser usado depois que o painel carregar.",
    );
  }
  return data;
};
