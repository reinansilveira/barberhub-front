import { create } from "zustand";

export type DashboardModal = "appointment" | "service" | "barber";

type DashboardModalsState = {
  activeModal: DashboardModal | null;
  openModal: (modal: DashboardModal) => void;
  closeModal: () => void;
};

export const useDashboardModalsStore = create<DashboardModalsState>()(
  (set) => ({
    activeModal: null,
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),
  }),
);

export const useOpenDashboardModal = () =>
  useDashboardModalsStore((state) => state.openModal);

export const useDashboardModal = (modal: DashboardModal) => {
  const isOpen = useDashboardModalsStore(
    (state) => state.activeModal === modal,
  );
  const closeModal = useDashboardModalsStore((state) => state.closeModal);
  return { isOpen, closeModal };
};
