/**
 * Standard formatter for Zambian Kwacha (ZMK)
 */
export const fmtZMK = (n: number) =>
  'K ' + n.toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Safely formats date strings, handling nulls and placeholders
 */
export const formatDate = (dateStr: string | null) => {
  if (!dateStr || dateStr === '-' || dateStr === '—') return '—';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-ZM', { day: 'numeric', month: 'short', year: 'numeric' });
};