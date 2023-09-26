export default class ColumnChart {
	constructor(config) {

		this.data = config.data;
        this.label = config.label;
        this.value = config.value;
        this.link = config.link;
		
		this.element = this.createElement();


   }

    createElement() {
		const element = document.createElement('div');
		element.innerHTML = this.template();
		return element;
   }

    template() {	
		return (
   			`
			<div class="dashboard__chart_orders">
			    <div class="column-chart" style="--chart-height: 50">
			        <div class="column-chart__title">
			            Total ${ this.label }
			            <a href="${ this.link }" class="column-chart__link">View all</a>
			        </div>
			        <div class="column-chart__container">
			            <div data-element="header" class="column-chart__header">${ this.value }</div>
			            <div data-element="body" class="column-chart__chart">

				            		${ this.data.map((value) => `<div style="--value: ${ value }" data-tooltip=" ${ value } "></div>` )}
 
			            </div>
			        </div>
			    </div>
			</div>
   			`
   			)

   }

    remove() {
		this.element.remove();

   }

    destroy() {
		this.remove();
   }

    render() {
		container.appendChild(this.element);
   }

   formatHeading() {

   }
}
