/**
 * Viewlytics — Utilidades de Formato
 *
 * Funciones puras de ayuda para formatear números, fechas y métricas analíticas.
 * No contiene lógica de negocio — solo transformaciones de presentación.
 */

/**
 * Formatea un número de suscriptores/vistas a una representación legible.
 * Ej: 1_420_000 → "1.4M", 890_000 → "890K"
 */
export function formatCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toString();
}

/**
 * Formatea una tasa de crecimiento con símbolo +/-.
 * Ej: 12.4 → "+12.4%", -3.2 → "-3.2%"
 */
export function formatGrowthRate(rate: number): string {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
}

/**
 * Formatea una fecha ISO a etiqueta de mes corto.
 * Ej: "2026-05" → "May", "2025-12" → "Dec"
 */
export function formatMonthLabel(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
}

/**
 * Clase utilitaria para combinar clases de Tailwind condicionalmente.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
