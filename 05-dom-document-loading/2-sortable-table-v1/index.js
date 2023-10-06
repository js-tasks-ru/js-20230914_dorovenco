export default class SortableTable {
  constructor(headerConfig = [], data = []) {

    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();

    this.subElements = { body: this.element.querySelector('[data-element="body"]'), };
  }

  render(container = document.body) {
    container.appendChild(this.element);
  }


  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return this.createTableTemplate();
  }

  createTableTemplate() {
    return (

      `
	<div data-element="productsContainer" class="products-list__container">
	    <div class="sortable-table">
	    	<div data-element="header" class="sortable-table__header sortable-table__row">

	    		${ this.createTableHeaderTemplate() }

	    	</div>
	        <div data-element="body" class="sortable-table__body">

	            ${ this.createTableRowsTemplate() }

	        </div>
	        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
	        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
	            <div>
	                <p>No products satisfies your filter criteria</p>
	                <button type="button" class="button-primary-outline">Reset all filters</button>
	            </div>
	        </div>
	    </div>
	</div>
	
	`);
  }

  createTableHeaderTemplate = () => this.headerConfig.map(header =>
    `
            <div class="sortable-table__cell" data-id="${ header.id }" data-sortable="${ header.sortable }" >
                <span>${ header.title }</span>
            </div>

	    `).join('')


  createTableRowsTemplate = (data = this.data) => data.map(product =>
    `
      <a href="/products/${ product.id }" class="sortable-table__row">
      	${ this.createTableCell(product) }
      </a>
      `).join('')

  createTableCell = (product) => this.headerConfig.map(header =>
    `
       ${ header.id == 'images' ? header.template('images') : '<div class="sortable-table__cell">' + product[header.id] + '</div>'}

	`
  ).join('')

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    this.subElements.body.innerHTML = this.createTableRowsTemplate(sortedData);
  }

  //By Aleksandr Shaposhnikov
  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string' :
        return direction * a[field].localeCompare(b[field], ['ru', 'en']);
      default :
        throw new Error(`Unknown type ${sortType}`);   
      }
    });
  }

}