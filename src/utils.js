export const getCurrentDate = () => {
  const now = new Date();

  return {
    day: now.getDate(), // 1-31
    month: now.getMonth() + 1, // 1-12 (added 1 because JS months start at 0)
    year: now.getFullYear(), // e.g., 2026
    timestamp: now.getTime(), // Useful for unique IDs or sorting
  };
};
