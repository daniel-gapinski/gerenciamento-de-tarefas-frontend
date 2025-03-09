export function formatDate(date: string| Date) {
  const newDate = new Date(date).toLocaleDateString('pt-BR');
  return newDate;
}
