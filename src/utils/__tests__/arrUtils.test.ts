import { chunk, getCollection, mapCollection, rotateLeft, rotateRight } from '../arrUtils';

const FIBONACCI = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

test('chunk', () => {
  expect(chunk<number>(FIBONACCI)).toHaveLength(12);
  expect(chunk<number>(FIBONACCI, 2)).toHaveLength(6);
});

describe('getDaysCollection', () => {
  const DEFAULT_DAYS = {
    en: {
      'Day.Sunday': 'Sunday',
      'Day.Monday': 'Monday',
      'Day.Tuesday': 'Tuesday',
      'Day.Wednesday': 'Wednesday',
      'Day.Thursday': 'Thursday',
      'Day.Friday': 'Friday',
      'Day.Saturday': 'Saturday'
    }
  };

  const getDaysCollection = getCollection([
    'Day.Sunday',
    'Day.Monday',
    'Day.Tuesday',
    'Day.Wednesday',
    'Day.Thursday',
    'Day.Friday',
    'Day.Saturday'
  ]);

  test('defaultMessages', () => {
    expect(getDaysCollection('en')({ defaultMessages: DEFAULT_DAYS })).toHaveLength(7);
    expect(getDaysCollection('en')({ defaultMessages: DEFAULT_DAYS })[0]).toEqual('Sunday');
  });

  test('customMessages', () => {
    const customMessages = { 'Day.Sunday': 'Dimanche' };
    expect(getDaysCollection('en')({ defaultMessages: DEFAULT_DAYS, customMessages })).toHaveLength(7);
    expect(getDaysCollection('en')({ defaultMessages: DEFAULT_DAYS, customMessages })[0]).toEqual('Dimanche');
  });

  test('fallback', () => {
    expect(getDaysCollection('fr')({ defaultMessages: DEFAULT_DAYS })).toHaveLength(7);
    expect(getDaysCollection('fr')({ defaultMessages: DEFAULT_DAYS })[0]).toEqual('Day.Sunday');
  });
});

describe('getMonthsCollection', () => {
  const DEFAULT_MONTHS = {
    en: {
      'Month.January': 'January',
      'Month.February': 'February',
      'Month.March': 'March',
      'Month.April': 'April',
      'Month.May': 'May',
      'Month.June': 'June',
      'Month.July': 'July',
      'Month.August': 'August',
      'Month.September': 'September',
      'Month.October': 'October',
      'Month.November': 'November',
      'Month.December': 'December'
    }
  };

  const getMonthsCollection = getCollection([
    'Month.January',
    'Month.February',
    'Month.March',
    'Month.April',
    'Month.May',
    'Month.June',
    'Month.July',
    'Month.August',
    'Month.September',
    'Month.October',
    'Month.November',
    'Month.December'
  ]);

  test('defaultMessages', () => {
    expect(getMonthsCollection('en')({ defaultMessages: DEFAULT_MONTHS })).toHaveLength(12);
    expect(getMonthsCollection('en')({ defaultMessages: DEFAULT_MONTHS })[0]).toEqual('January');
  });

  test('customMessages', () => {
    const customMessages = { 'Month.January': 'Janvier' };
    expect(getMonthsCollection('en')({ defaultMessages: DEFAULT_MONTHS, customMessages })).toHaveLength(12);
    expect(getMonthsCollection('en')({ defaultMessages: DEFAULT_MONTHS, customMessages })[0]).toEqual('Janvier');
  });

  test('fallback', () => {
    expect(getMonthsCollection('fr')({ defaultMessages: DEFAULT_MONTHS })).toHaveLength(12);
    expect(getMonthsCollection('fr')({ defaultMessages: DEFAULT_MONTHS })[0]).toEqual('Month.January');
  });
});

test('mapCollection', () => {
  const fibonacciMap = mapCollection<number>(FIBONACCI);

  expect(fibonacciMap[-5]).toEqual(13);
  expect(fibonacciMap[0]).toEqual(0);
  expect(fibonacciMap[5]).toEqual(5);
});

test('rotateLeft', () => {
  expect(rotateLeft<number>(FIBONACCI)[0]).toEqual(0);
  expect(rotateLeft<number>(FIBONACCI, 5)[0]).toEqual(13);
});

test('rotateRight', () => {
  expect(rotateRight<number>(FIBONACCI)[0]).toEqual(0);
  expect(rotateRight<number>(FIBONACCI, 5)[0]).toEqual(5);
});
