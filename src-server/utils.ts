export const getNumberVariable = (variableName: string, def: number): number => {
  const value = process.env[variableName];
  if (value) return +value;
  return def;
};

const units = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30.5 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
  ['second', 1000],
] as const;

export function timeAgo(date: Date) {
  const diff = Math.abs(Date.now() - date.getTime());
  for (const [name, size] of units) {
    const value = Math.round(diff / size);
    if (value > 0) {
      const plural = value > 1 ? 's' : '';
      return `${value} ${name}${plural}`;
    }
  }
  return 'just now';
}
