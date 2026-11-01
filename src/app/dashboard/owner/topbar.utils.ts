export type TopbarSuggestion = { label: string; detail: string; href: string };

export const TOPBAR_SUGGESTIONS: TopbarSuggestion[] = [
  { label: "Painel", detail: "Visão geral", href: "/dashboard" },
  { label: "Agenda", detail: "Agendamentos", href: "/dashboard?view=agenda" },
  {
    label: "Barbeiros",
    detail: "Equipe e desempenho",
    href: "/dashboard?view=profissionais",
  },
  {
    label: "Serviços",
    detail: "Catálogo e preços",
    href: "/dashboard?view=catalogo",
  },
  {
    label: "Financeiro",
    detail: "Receitas e despesas",
    href: "/dashboard?view=metricas",
  },
];

export const filterSuggestions = (query: string, services: string[]) => {
  const normalized = query.toLowerCase().trim();
  const serviceSuggestions = services.slice(0, 5).map((service) => ({
    label: service,
    detail: "Serviço do catálogo",
    href: "/dashboard?view=catalogo",
  }));

  return [...TOPBAR_SUGGESTIONS, ...serviceSuggestions]
    .filter(
      (item) =>
        !normalized ||
        `${item.label} ${item.detail}`.toLowerCase().includes(normalized),
    )
    .slice(0, 6);
};
