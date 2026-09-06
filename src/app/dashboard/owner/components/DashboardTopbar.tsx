"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "../../_shared/dashboard.utils";

type DashboardTopbarProps = { userName: string; userAvatar?: string | null; services: string[] };
type Suggestion = { label: string; detail: string; href: string };

const defaultStart = new Date(2024, 10, 18);
const defaultEnd = new Date(2024, 10, 24);
const suggestions: Suggestion[] = [
  { label: "Painel", detail: "Visão geral", href: "/dashboard" },
  { label: "Agenda", detail: "Agendamentos", href: "/dashboard?view=agenda" },
  { label: "Barbeiros", detail: "Equipe e desempenho", href: "/dashboard?view=profissionais" },
  { label: "Serviços", detail: "Catálogo e preços", href: "/dashboard?view=catalogo" },
  { label: "Financeiro", detail: "Receitas e despesas", href: "/dashboard?view=metricas" },
];
const initialNotifications = [
  { id: 1, title: "New comment", description: "", time: "2 minutes ago", unread: true },
  { id: 2, title: "New follower", description: "", time: "1 hour ago", unread: true },
  { id: 3, title: "Update available", description: "", time: "3 hours ago", unread: true },
];

function sameDay(first: Date | null, second: Date) {
  return Boolean(first && first.toDateString() === second.toDateString());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date).replace(" de ", " ");
}

function monthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = first.getDay();
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1;
    return day < 1 || day > total ? null : new Date(month.getFullYear(), month.getMonth(), day);
  });
}

export function DashboardTopbar({ userName, userAvatar, services }: DashboardTopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(defaultStart));
  const [startDate, setStartDate] = useState<Date | null>(defaultStart);
  const [endDate, setEndDate] = useState<Date | null>(defaultEnd);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const matches = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    const serviceMatches = services.slice(0, 5).map((service) => ({ label: service, detail: "Serviço do catálogo", href: "/dashboard?view=catalogo" }));
    return [...suggestions, ...serviceMatches].filter((item) => !normalized || `${item.label} ${item.detail}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query, services]);
  const days = monthDays(calendarMonth);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(calendarMonth);
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  useEffect(() => {
    const closeNotifications = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dashboard-topbar__notifications")) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closeNotifications);
    return () => document.removeEventListener("mousedown", closeNotifications);
  }, []);

  function selectDay(day: Date) {
    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate(null);
      return;
    }
    if (day < startDate) {
      setEndDate(startDate);
      setStartDate(day);
    } else {
      setEndDate(day);
    }
    setCalendarOpen(false);
  }

  return (
    <header className="topbar dashboard-shell__topbar">
      <div className="topbar__container dashboard-topbar">
        <div className="dashboard-topbar__search-wrap">
          <label className="dashboard-topbar__search">
            <Search aria-hidden="true" />
            <input aria-label="Pesquisar no dashboard" value={query} placeholder="Pressione / para pesquisar" onFocus={() => setSearchOpen(true)} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }} />
            {query && <button type="button" aria-label="Limpar busca" onClick={() => setQuery("")}><X aria-hidden="true" /></button>}
          </label>
          {searchOpen && <div className="dashboard-topbar__command" role="listbox"><div className="dashboard-topbar__command-heading">Navegação rápida</div>{matches.length ? matches.map((item) => <button type="button" role="option" aria-selected="false" key={`${item.label}-${item.href}`} onClick={() => { router.push(item.href); setSearchOpen(false); setQuery(""); }}><span>{item.label}</span><small>{item.detail}</small></button>) : <p>Nenhum resultado encontrado.</p>}</div>}
        </div>

        <div className="dashboard-topbar__actions">
          <div className="dashboard-topbar__calendar-wrap">
            <button type="button" className="dashboard-topbar__calendar-trigger" aria-expanded={calendarOpen} onClick={() => setCalendarOpen((open) => !open)}>
              <CalendarDays aria-hidden="true" /><span>{startDate ? formatDate(startDate) : "Selecionar período"}{endDate ? ` – ${formatDate(endDate)}` : ""}</span><ChevronDown aria-hidden="true" />
            </button>
            {calendarOpen && <div className="dashboard-topbar__calendar" role="dialog" aria-label="Selecionar período">
              <div className="dashboard-topbar__calendar-header"><button type="button" aria-label="Mês anterior" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><ChevronLeft /></button><strong>{monthLabel}</strong><button type="button" aria-label="Próximo mês" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}><ChevronRight /></button></div>
              <div className="dashboard-topbar__calendar-weekdays">{["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
              <div className="dashboard-topbar__calendar-grid">{days.map((day, index) => day ? <button type="button" key={day.toISOString()} className={`${sameDay(startDate, day) ? "is-start " : ""}${sameDay(endDate, day) ? "is-end " : ""}${startDate && endDate && day > startDate && day < endDate ? "is-between" : ""}`} onClick={() => selectDay(day)}>{day.getDate()}</button> : <span key={`empty-${index}`} />)}</div>
              <div className="dashboard-topbar__calendar-footer"><button type="button" onClick={() => { setStartDate(defaultStart); setEndDate(defaultEnd); setCalendarMonth(new Date(defaultStart)); setCalendarOpen(false); }}>Período padrão</button><button type="button" onClick={() => setCalendarOpen(false)}>Concluir</button></div>
            </div>}
          </div>
          <span className="dashboard-topbar__divider" aria-hidden="true" />
          <div className="dashboard-topbar__notifications">
            <button type="button" className="dashboard-topbar__notifications-trigger" aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ""}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>
              <Bell aria-hidden="true" />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
            {notificationsOpen && <div className="dashboard-topbar__notifications-popover" role="dialog" aria-label="Notificações">
              <div className="dashboard-topbar__notifications-heading"><h2>Notifications</h2><button type="button" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))} disabled={!unreadCount}>Mark all as read</button></div>
              <div className="dashboard-topbar__notifications-list">{notifications.map((notification) => <button type="button" className={`dashboard-topbar__notification ${notification.unread ? "is-unread" : ""}`} key={notification.id} onClick={() => setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, unread: false } : item))}><span className="dashboard-topbar__notification-dot" aria-hidden="true" /><span><b>{notification.title}</b><time>{notification.time}</time></span></button>)}</div>
            </div>}
          </div>
          <Avatar className="user"><AvatarImage src={userAvatar || `https://i.pravatar.cc/80?u=${encodeURIComponent(userName)}`} alt={userName} /><AvatarFallback>{initials(userName)}</AvatarFallback><AvatarBadge /></Avatar>
          <span className="userName">{userName}</span>
        </div>
      </div>
    </header>
  );
}
