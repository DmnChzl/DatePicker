/**
 * Create an array of array, based on the size parameter
 *
 * @param {Array} arr The original array
 * @param {number} size (default: 1)
 * @returns {Array}
 */
export function chunk<T>(arr: Array<T>, size = 1): Array<Array<T>> {
  if (arr instanceof Array) {
    let res = [];

    for (let idx = 0; idx < arr.length; idx++) {
      const chunkIdx = Math.floor(idx / size);
      if (!res[chunkIdx]) res[chunkIdx] = [];
      res[chunkIdx] = [...res[chunkIdx], arr[idx]];
    }

    return res;
  }

  throw new Error('NaA: Not an Array');
}

interface Messages {
  defaultMessages: Record<string, Record<string, string>>;
  customMessages?: Record<string, string>;
}

/**
 * Retrieves messages associated with values,
 * according to the locale (as key),
 * and a list of default / custom messages
 *
 * @param {string[]} values List of keys
 * @returns {Function}
 */
export const getCollection = (values: string[]) => (key: string) => {
  /**
   * @returns {string[]} List of default / custom values
   */
  return ({ defaultMessages, customMessages }: Messages): string[] => {
    return values.map(val => customMessages?.[val] || defaultMessages[key]?.[val] || val);
  };
};

/**
 * Create a mapped object, ranging from the negative value of the size (+1)
 * of the array passed in parameter, to its original size
 *
 * @param {Array} collection The original array
 * @returns {Record}
 */
export function mapCollection<T>(collection: Array<T>): Record<number, T> {
  const [val, ...values] = collection;

  let result = { 0: val };

  for (let idx = 0; idx < values.length; idx++) {
    result = {
      [idx - values.length]: values[idx],
      ...result,
      [idx + 1]: values[idx]
    };
  }

  return result;
}

/**
 * Updates the array passed as a parameter,
 * by rotating its elements from right to left
 *
 * @param {Array} arr The original array
 * @param {number} offset (default: 0)
 * @returns {Array}
 */
export function rotateLeft<T>(arr: Array<T>, offset = 0): Array<T> {
  if (arr instanceof Array) {
    for (let idx = 0; idx < offset; idx++) {
      const value = arr.pop();
      if (value) arr = [value, ...arr];
    }

    return arr;
  }

  throw new Error('NaA: Not an Array');
}

/**
 * Updates the array passed as a parameter,
 * by rotating its elements from left to right
 *
 * @param {Array} arr The original array
 * @param {number} offset (default: 0)
 * @returns {Array}
 */
export function rotateRight<T>(arr: Array<T>, offset = 0): Array<T> {
  if (arr instanceof Array) {
    for (let idx = 0; idx < offset; idx++) {
      const value = arr.shift();
      if (value) arr = [...arr, value];
    }

    return arr;
  }

  throw new Error('NaA: Not an Array');
}
