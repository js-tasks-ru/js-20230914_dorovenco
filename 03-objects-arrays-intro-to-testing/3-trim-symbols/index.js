/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let cnt = 1
  let trimmed = ''

  if (size === 0) {
    return ''
  }

  if (!size) {
    return string
  }

  for (let i = 0; i < string.length; i++) {

    if (string[i] === string[i + 1]) {
      if (cnt < size) {
        trimmed += string[i];
      }
      cnt++;
    } else {
      cnt = 1;
      trimmed += string[i];
    }
  }
  return trimmed
}
