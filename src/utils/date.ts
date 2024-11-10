import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getStartAndEndDates = (
  viewMode: 'day' | 'week' | 'month',
  selectedDate: Date | [Date, Date]
) => {
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  if (viewMode === 'week' && Array.isArray(selectedDate)) {
    start = dayjs(selectedDate[0]).startOf('day');
    end = dayjs(selectedDate[1]).endOf('day');
  } else {
    const date = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
    start = dayjs(date).startOf(viewMode);
    end = dayjs(date).endOf(viewMode);
  }

  return { start, end };
};

export const isDateInRange = (date: string, start: dayjs.Dayjs, end: dayjs.Dayjs) => {
  const entryDate = dayjs(date).startOf('day');
  return entryDate.isSameOrAfter(start) && entryDate.isSameOrBefore(end);
};
