import dayjs from "dayjs";

export const getDateRange = (dateType, customDates = null) => {
  const today = dayjs();
  switch (dateType) {
    case "allTime":
      return { startDate: null, endDate: null };
    case "currentYear":
      return {
        startDate: today.startOf("year").format("YYYY-MM-DD"),
        endDate: today.endOf("year").format("YYYY-MM-DD"),
      };
    case "currentMonth":
      return {
        startDate: today.startOf("month").format("YYYY-MM-DD"),
        endDate: today.endOf("month").format("YYYY-MM-DD"),
      };
    case "currentWeek":
      return {
        startDate: today.startOf("week").format("YYYY-MM-DD"),
        endDate: today.endOf("week").format("YYYY-MM-DD"),
      };
    case "customDate":
      if (customDates && customDates.length === 2) {
        return {
          startDate: dayjs(customDates[0]).format("YYYY-MM-DD"),
          endDate: dayjs(customDates[1]).format("YYYY-MM-DD"),
        };
      }
      return { startDate: null, endDate: null };
    default:
      return { startDate: null, endDate: null };
  }
};