"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Appointment } from "@/services/appointment";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  findAllProfessionals,
  updateProfessional,
  type ProfessionalResponseDto,
} from "@/services/professional";
import { updateService, type Service } from "@/services/service";
import type { Payment, OwnerView } from "../owner.types";

type CalendarFilter = "day" | "week" | "month";
type FinancialPeriod = "week" | "month" | "year";
type EntityAction = "edit" | "metrics" | null;

type CalendarEvent = [number, string, string, string];

type CalendarDay = {
  label: string;
  date: string;
  fullDate: Date;
  events: CalendarEvent[];
};

const emptyServiceEdit = {
  name: "",
  price: "",
  duration: "",
  description: "",
  category: "",
};

const emptyProfessionalEdit = {
  specialty: "",
  experience: "",
  commission: "",
  bio: "",
};

const isSameDay = (first: Date, second: Date) =>
  first.toDateString() === second.toDateString();

const getWeekStart = (date: Date) => {
  const weekStart = new Date(date);
  const weekday = weekStart.getDay() || 7;

  weekStart.setDate(weekStart.getDate() - weekday + 1);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
};

export const useReferencePanels = ({
  view,
  services,
  appointments,
  payments,
}: {
  view: OwnerView;
  services: Service[];
  appointments: Appointment[];
  payments: Payment[];
}) => {
  const router = useRouter();
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>("month");
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [barberAction, setBarberAction] = useState<EntityAction>(null);
  const [openBarberMenu, setOpenBarberMenu] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceAction, setServiceAction] = useState<EntityAction>(null);
  const [openServiceMenu, setOpenServiceMenu] = useState<string | null>(null);
  const [financialPeriod, setFinancialPeriod] =
    useState<FinancialPeriod>("week");
  const [professionals, setProfessionals] = useState<ProfessionalResponseDto[]>(
    [],
  );
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [serviceEdit, setServiceEdit] = useState(emptyServiceEdit);
  const [professionalEdit, setProfessionalEdit] = useState(
    emptyProfessionalEdit,
  );

  useEffect(() => {
    if (view !== "profissionais") return;

    let isCurrent = true;

    findAllProfessionals(true)
      .then((data) => {
        if (isCurrent) setProfessionals(data);
      })
      .catch(() => {
        if (isCurrent) setProfessionals([]);
      });

    return () => {
      isCurrent = false;
    };
  }, [view]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setSelectedBarber(null);
      setSelectedService(null);
      setOpenBarberMenu(null);
      setOpenServiceMenu(null);
    };
    const closeMenusOnOutsideClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      if (
        event.target.closest(".barber-card__menu-wrap") ||
        event.target.closest(".service-card__menu-wrap")
      ) {
        return;
      }

      setOpenBarberMenu(null);
      setOpenServiceMenu(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeMenusOnOutsideClick);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeMenusOnOutsideClick);
    };
  }, []);

  const openServiceEdit = useCallback(
    (name: string) => {
      const service = services.find((item) => item.name === name);

      setEditError("");
      setServiceEdit({
        name: service?.name || name,
        price: String(service?.price ?? ""),
        duration: String(service?.duration ?? ""),
        description: service?.description || "",
        category: service?.category || "",
      });
      setSelectedService(name);
      setServiceAction("edit");
    },
    [services],
  );

  const openProfessionalEdit = useCallback(
    (name: string) => {
      const professional = professionals.find(
        (item) => item.user.name === name,
      );

      setEditError("");
      setProfessionalEdit({
        specialty: professional?.specialty || "",
        experience: String(professional?.experience ?? ""),
        commission: String(professional?.commission ?? ""),
        bio: professional?.bio || "",
      });
      setSelectedBarber(name);
      setBarberAction("edit");
    },
    [professionals],
  );

  const saveServiceEdit = useCallback(async () => {
    const service = services.find((item) => item.name === selectedService);
    const price = Number(serviceEdit.price.replace(",", "."));
    const duration = Number(serviceEdit.duration);

    if (!service?.id) {
      setEditError("Não foi possível localizar este serviço no backend.");
      return;
    }

    if (
      !serviceEdit.name.trim() ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(duration) ||
      duration < 1
    ) {
      setEditError("Informe nome, preço e duração válidos.");
      return;
    }

    setSavingEdit(true);
    setEditError("");

    try {
      await updateService(service.id, {
        name: serviceEdit.name.trim(),
        price,
        duration,
        description: serviceEdit.description.trim() || undefined,
        category: serviceEdit.category.trim() || undefined,
      });
      setSelectedService(null);
      router.refresh();
    } catch (requestError) {
      setEditError(
        apiErrorMessage(requestError, "Não foi possível salvar o serviço."),
      );
    } finally {
      setSavingEdit(false);
    }
  }, [router, selectedService, serviceEdit, services]);

  const saveProfessionalEdit = useCallback(async () => {
    const professional = professionals.find(
      (item) => item.user.name === selectedBarber,
    );

    if (!professional) {
      setEditError("Não foi possível localizar este profissional no backend.");
      return;
    }

    setSavingEdit(true);
    setEditError("");

    try {
      await updateProfessional(professional.id, {
        specialty: professionalEdit.specialty || undefined,
        experience: professionalEdit.experience
          ? Number(professionalEdit.experience)
          : undefined,
        commission: professionalEdit.commission
          ? Number(professionalEdit.commission)
          : undefined,
        bio: professionalEdit.bio || undefined,
      });
      setSelectedBarber(null);
      router.refresh();
    } catch (requestError) {
      setEditError(
        apiErrorMessage(
          requestError,
          "Não foi possível salvar o profissional.",
        ),
      );
    } finally {
      setSavingEdit(false);
    }
  }, [professionalEdit, professionals, router, selectedBarber]);

  const calendar = useMemo(() => {
    const calendarAnchor = new Date(calendarDate);
    const weekStart = getWeekStart(calendarAnchor);
    const appointmentsByDate = new Map<string, Appointment[]>();

    appointments.forEach((appointment) => {
      const key = new Date(appointment.scheduledAt).toDateString();
      const entries = appointmentsByDate.get(key) ?? [];

      entries.push(appointment);
      appointmentsByDate.set(key, entries);
    });
    const days = Array.from({ length: 7 }, (_, index): CalendarDay => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(dayDate.getDate() + index);
      const entries = appointmentsByDate.get(dayDate.toDateString()) ?? [];

      return {
        label: dayDate
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", "")
          .toUpperCase(),
        date: String(dayDate.getDate()),
        fullDate: dayDate,
        events: entries.map(
          (item, eventIndex) =>
            [
              Math.max(0, new Date(item.scheduledAt).getHours() - 7),
              item.service?.name ?? "Serviço",
              `${item.client.name} · ${item.professional?.name ?? "Profissional"}`,
              ["mint", "yellow", "violet"][eventIndex % 3],
            ] as CalendarEvent,
        ),
      };
    });
    const selectedDay =
      days.find((day) => isSameDay(day.fullDate, calendarDate)) ?? days[0];
    const monthStart = new Date(
      calendarAnchor.getFullYear(),
      calendarAnchor.getMonth(),
      1,
    );
    const monthGridStart = new Date(monthStart);
    monthGridStart.setDate(monthGridStart.getDate() - monthGridStart.getDay());
    const monthCells = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(monthGridStart);
      date.setDate(date.getDate() + index);

      return {
        date,
        outside: date.getMonth() !== calendarAnchor.getMonth(),
      };
    });
    const periodLabel =
      calendarFilter === "day"
        ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
            calendarAnchor,
          )
        : calendarFilter === "month"
          ? new Intl.DateTimeFormat("pt-BR", {
              month: "long",
              year: "numeric",
            }).format(calendarAnchor)
          : `${new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "short",
            }).format(weekStart)} – ${new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(days[6].fullDate)}`;
    const dailySchedule = [
      ...(appointmentsByDate.get(selectedDay.fullDate.toDateString()) ?? []),
    ].sort(
      (first, second) =>
        +new Date(first.scheduledAt) - +new Date(second.scheduledAt),
    );
    const recentCancellations = appointments
      .filter((item) => /cancel/i.test(item.status))
      .sort(
        (first, second) =>
          +new Date(second.scheduledAt) - +new Date(first.scheduledAt),
      )
      .slice(0, 3);

    return {
      days,
      monthCells,
      appointmentsByDate,
      periodLabel,
      selectedDay,
      dailySchedule,
      recentCancellations,
    };
  }, [appointments, calendarDate, calendarFilter]);

  const navigateCalendarPeriod = useCallback(
    (direction: -1 | 1) => {
      setCalendarDate((current) => {
        const next = new Date(current);

        if (calendarFilter === "month") {
          const day = next.getDate();
          next.setDate(1);
          next.setMonth(next.getMonth() + direction);
          next.setDate(
            Math.min(
              day,
              new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate(),
            ),
          );
          return next;
        }

        next.setDate(
          next.getDate() + (calendarFilter === "week" ? 7 : 1) * direction,
        );
        return next;
      });
    },
    [calendarFilter],
  );

  const financial = useMemo(() => {
    const paidPayments = payments.filter((item) => item.status === "PAID");
    const totalRevenue = paidPayments.reduce(
      (total, item) => total + Number(item.finalAmount || 0),
      0,
    );
    const now = new Date();
    const periodRevenue = paidPayments
      .filter((item) => {
        const value = item.paidAt ?? item.createdAt;
        if (!value) return false;

        const date = new Date(value);
        if (financialPeriod === "year") {
          return date.getFullYear() === now.getFullYear();
        }
        if (financialPeriod === "month") {
          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth()
          );
        }

        return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
      })
      .reduce((total, item) => total + Number(item.finalAmount || 0), 0);

    return {
      totalRevenue,
      averageTicket: paidPayments.length
        ? totalRevenue / paidPayments.length
        : 0,
      periodRevenue,
    };
  }, [financialPeriod, payments]);

  return {
    calendar: {
      filter: calendarFilter,
      setFilter: setCalendarFilter,
      date: calendarDate,
      setDate: setCalendarDate,
      navigate: navigateCalendarPeriod,
      ...calendar,
    },
    professionals: {
      list: professionals,
      selected: selectedBarber,
      setSelected: setSelectedBarber,
      action: barberAction,
      setAction: setBarberAction,
      openMenu: openBarberMenu,
      setOpenMenu: setOpenBarberMenu,
      edit: professionalEdit,
      setEdit: setProfessionalEdit,
      openEdit: openProfessionalEdit,
      saveEdit: saveProfessionalEdit,
    },
    services: {
      selected: selectedService,
      setSelected: setSelectedService,
      action: serviceAction,
      setAction: setServiceAction,
      openMenu: openServiceMenu,
      setOpenMenu: setOpenServiceMenu,
      edit: serviceEdit,
      setEdit: setServiceEdit,
      openEdit: openServiceEdit,
      saveEdit: saveServiceEdit,
    },
    financial: {
      period: financialPeriod,
      setPeriod: setFinancialPeriod,
      ...financial,
    },
    editError,
    savingEdit,
  };
};

export type ReferencePanelsModel = ReturnType<typeof useReferencePanels>;
