import type { ReactNode } from "react";

const ICON_PROPS = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export const SERVICE_CATEGORY_ICONS: Record<string, ReactNode> = {
    barbearia: (
        <svg {...ICON_PROPS}>
            <circle cx="7" cy="7" r="1.7" />
            <circle cx="7" cy="17" r="1.7" />
            <path d="M8.2 8.2 16 16" />
            <path d="M8.2 15.8 16 8" />
            <path d="M13.8 10.2 18 6" />
            <path d="M13.8 13.8 18 18" />
        </svg>
    ),
    cabelo: (
        <svg {...ICON_PROPS}>
            <path d="M7 4c-1.8 2.1-2.8 4.5-2.8 7.2 0 4.3 2.8 7.4 7.8 7.4" />
            <path d="M17 4c1.8 2.1 2.8 4.5 2.8 7.2 0 4.3-2.8 7.4-7.8 7.4" />
            <path d="M9 10.2c.9 1.3 1.8 1.9 3 1.9s2.1-.6 3-1.9" />
            <path d="M10 16.6c1.1.5 2.8.5 4 0" />
        </svg>
    ),
    barba: (
        <svg {...ICON_PROPS}>
            <path d="M7 7c0 3.7 2.1 8.8 5 10.8 2.9-2 5-7.1 5-10.8" />
            <path d="M8 9.5c.9 1 2.1 1.5 4 1.5s3.1-.5 4-1.5" />
            <path d="M9 18.4c1.4-.6 2.8-.9 3-.9s1.6.3 3 .9" />
            <path d="M12 4.5v2" />
        </svg>
    ),
    tratamento: (
        <svg {...ICON_PROPS}>
            <path d="M12 3.5c1.9 3 5.5 6.2 5.5 10a5.5 5.5 0 0 1-11 0c0-3.8 3.6-7 5.5-10Z" />
            <path d="M9.3 13.3c.5 1.4 1.6 2.3 3 2.6" />
        </svg>
    ),
    hidratacao: (
        <svg {...ICON_PROPS}>
            <path d="M12 3.7c1.7 2.7 5 5.6 5 9.1a5 5 0 1 1-10 0c0-3.5 3.3-6.4 5-9.1Z" />
            <path d="M9.7 13.1c.4 1.1 1.3 1.9 2.3 2.2" />
        </svg>
    ),
    default: (
        <svg {...ICON_PROPS}>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    ),
};

export function getCategoryIcon(category?: string) {
    const normalized = String(category ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^\w_]/g, "");

    if (!normalized) return SERVICE_CATEGORY_ICONS.default;
    if (normalized in SERVICE_CATEGORY_ICONS) return SERVICE_CATEGORY_ICONS[normalized];

    if (normalized.includes("barb")) return SERVICE_CATEGORY_ICONS.barbearia;
    if (normalized.includes("corte") || normalized.includes("cabelo")) return SERVICE_CATEGORY_ICONS.cabelo;
    if (normalized.includes("hidr") || normalized.includes("trat")) return SERVICE_CATEGORY_ICONS.hidratacao;
    if (normalized.includes("limp") || normalized.includes("skin") || normalized.includes("barba")) return SERVICE_CATEGORY_ICONS.tratamento;

    return SERVICE_CATEGORY_ICONS.default;
}
