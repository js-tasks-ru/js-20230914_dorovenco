/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

function asc (a, b) {
  return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
}

function desc (a, b) {
  return b.localeCompare(a, ['ru', 'en'], { caseFirst: 'upper' });
}

export function sortStrings(arr, param = 'asc') {	
  const sorted = arr. slice();
  return param == 'asc' ? sorted.sort(asc) : sorted.sort(desc);
}
