export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, symbol = "$") {
  return `${symbol}${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
