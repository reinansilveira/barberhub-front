import type { Payment } from "./owner.types";
import { paymentProfessionalName, paymentServiceName } from "./owner.utils";

const csvCell = (value: unknown) => {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
};

const formatDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("pt-BR").format(new Date(value)) : "";

export const buildFinancialReportCsv = (payments: Payment[]) => {
  const rows = payments.map((payment) => [
    payment.id,
    formatDate(payment.paidAt ?? payment.createdAt),
    paymentServiceName(payment),
    paymentProfessionalName(payment),
    payment.method ?? "",
    payment.status,
    Number(payment.finalAmount || 0)
      .toFixed(2)
      .replace(".", ","),
  ]);
  const header = [
    "ID",
    "Data",
    "Serviço",
    "Profissional",
    "Forma de pagamento",
    "Status",
    "Valor (R$)",
  ];
  return [header, ...rows]
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n");
};

export const exportFinancialReport = (payments: Payment[]) => {
  const csv = buildFinancialReportCsv(payments);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  const reportDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  anchor.download = `relatorio-financeiro-${reportDate}.csv`;
  anchor.dataset.financialReportDownload = "true";
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 10_000);
};
