/**
 * Get locale based on navigator language
 *
 * @returns {string}
 */
export const getLocale = (): string => {
  const [locale] = window.navigator.language.split(/[-_]/);
  return locale;
};

/**
 * Get the number of days in a month
 *
 * @param {number} year
 * @param {number} month
 * @returns {number}
 */
export const getNumberOfDays = (year: number, month: number): number => {
  return 42 - new Date(year, month, 42).getDate();
};

/**
 * Retrieves the year / month / day values,
 * according to the pattern passed as a parameter
 *
 * @param {string} value 'YYYY-MM-DD'
 * @returns {*} { year, month, date }
 */
export const getDateFromDateString = (value: string): { year: number; month: number; date: number } | null => {
  const values = value.split('-').map(val => +val);
  if (values.length < 3) return null;
  const [year, month, date] = values;
  return { year, month, date };
};

/**
 * Get the month as string according to its index
 *
 * @param {number[]} allMonths
 * @param {number} month
 * @returns {string}
 */
export const getMonthStr = (allMonths: string[], month: number): string => {
  return allMonths[Math.max(Math.min(11, month), 0)] || 'Month';
};

/**
 * Retrieves the date as pattern according to the timestamp passed as a parameter
 *
 * @param {number} timestamp
 * @returns {string} 'YYYY-MM-DD'
 */
export const getDateStringFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const dayOfTheMonth = date.getDate();

  return (
    date.getFullYear() +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (dayOfTheMonth < 10 ? '0' + dayOfTheMonth : dayOfTheMonth)
  );
};
