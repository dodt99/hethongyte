import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

export const dayjsFormat = dayjs.utc;
export const formatDateTime = (dateTime) => dayjsFormat(dateTime).utc().format('HH:mm DD/MM/YYYY');
export const formatLocalDateTime = (dateTime) => dayjs(dateTime).format('HH:mm DD/MM/YYYY');
export const formatDate = (dateTime) => dayjsFormat(dateTime).utc().format('DD/MM/YYYY');
export const formatDateDayMonth = (dateTime) => dayjs(dateTime).format('DD/MM');
export const formatDateMonthYear = (dateTime) => dayjs(dateTime).format('MM/YYYY');
export const formatYearMonth = (dateTime) => dayjs(dateTime).format('YYYY/MM');
export const formatTime = (dateTime) => dayjs(dateTime).format('HH:mm');
export const formatInputDate = (dateTime) => dayjsFormat(dateTime).format('YYYY-MM-DD');
export const formatLocalDate = (dateTime) => dayjs(dateTime).format('YYYY-MM-DD');
export const localDate = (dateTime) => dayjs(dateTime).format('DD-MM-YYYY');
export const formatLocalHour = (dateTime) => dayjs(dateTime).format('HH:mm');
export const formatUTCHour = (dateTime) => dayjsFormat(dateTime).format('HH:mm');
export const formatLocalDateTimeDatabase = (dateTime) => dayjsFormat(dateTime).format('YYYY-MM-DD HH:mm');

export const getYear = (dateTime) => new Date(dateTime).getFullYear();
export const getMonth = (dateTime) => new Date(dateTime).getMonth();
export const getDate = (dateTime) => new Date(dateTime).getDate();
export const getIsoWeek = (dateTime) => dayjs(dateTime).isoWeek();
export const getDay = (dateTime) => dayjs(dateTime).isoWeekday();
