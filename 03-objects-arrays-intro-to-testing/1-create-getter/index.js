/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
// export function createGetter(path) {
//     getter(path) { 
//     	return this.path 
//     }
// }


const product = {
  category: {
    title: "Goods"
  }
}

function createGetter(path) {

    	return this.path 
    
}

const getter = createGetter('category.title');
console.log(getter(product)); // Goods