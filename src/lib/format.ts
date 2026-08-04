const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** 1234.5 -> "R$ 1.234,50" */
export function formatCurrency(value: number): string {
  return brl.format(value);
}

/** "2025-01-15" -> "15/01/2025" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

/** "2025-01" -> "Jan/25" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const idx = Number(m) - 1;
  return y && idx >= 0 && idx < 12 ? `${MONTHS_PT[idx]}/${y.slice(2)}` : ym;
}
