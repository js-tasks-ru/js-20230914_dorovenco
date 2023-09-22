/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {

    let omitted = {}; 

        for (let key in obj) {
            for (let field of [...fields]) {	 
               if (field === key) { delete obj[key];} 
               
        } 
    }
    omitted = obj;
    return omitted
};
