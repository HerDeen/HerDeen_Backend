export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const startOfTheYear = () => {
  const year = new Date();
  year.getFullYear();
  return year;
};

// export function startOfDay(date: Date) {
//   return new Date(date.getFullYear(), date.getMonth(), date.getDate());
// }
export const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
