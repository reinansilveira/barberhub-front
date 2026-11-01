export { currency, initials } from "@/utils/format";

export const timeText = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function isCompleted(status: string) {
  return /confirm|complete|done|final/i.test(status);
}

export function isCancelled(status: string) {
  return /cancel/i.test(status);
}
