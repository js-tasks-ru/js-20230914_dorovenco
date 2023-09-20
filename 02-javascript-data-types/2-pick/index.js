/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */

export const pick = (obj, ...fields) => {

    let filtered = {}
	for (let key in obj) {
		for (let field of fields) {
			if (field === key) { filtered[key] = obj[key] } 
		} 
	}
	return filtered  
};
