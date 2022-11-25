import { vi } from 'vitest';
import {
  getDateFromDateString,
  getDateStringFromTimestamp,
  getLocale,
  getMonthStr,
  getNumberOfDays
} from '../dateUtils';

test('getLocale', () => {
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en');

  expect(getLocale()).toEqual('en');
});

test('getNumberOfDays', () => {
  expect(getNumberOfDays(2020, 10)).toEqual(30);
});

test('getDateFromDateString', () => {
  expect(getDateFromDateString('2020-10-30')).toEqual({
    year: 2020,
    month: 10,
    date: 30
  });
});

test('getMonthStr', () => {
  const allMonths = ['January', 'February', 'March'];

  expect(getMonthStr(allMonths, 1)).toEqual('February');
  expect(getMonthStr(allMonths, 3)).toEqual('Month');
});

test('getDateStringFromTimestamp', () => {
  const date = new Date('2020-10-30');

  expect(getDateStringFromTimestamp(date.getTime())).toEqual('2020-10-30');
});
