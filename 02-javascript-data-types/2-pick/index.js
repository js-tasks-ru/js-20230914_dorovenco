/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    let set = new Set([...fields]);
    let map = new Map(Object.entries(obj).filter(([key]) => set.has(key)));
    return Object.fromEntries(map);
};
