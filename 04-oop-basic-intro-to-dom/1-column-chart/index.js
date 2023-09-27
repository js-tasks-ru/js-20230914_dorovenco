export default class ColumnChart {
	chartHeight = 50;
	constructor({ data = [], label, value, link, formatHeading, }) {

		this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;
        this.formatHeading = formatHeading;
        this.chartHeight = 50;
		
		this.element = this.createElement();

   }

    createElement() {
		const element = document.createElement('div');
		element.innerHTML = this.template();
		return element.firstElementChild
   }

    template() {

		const maxValue = Math.max(...Object.values(this.data));
		
		return (
   			`
			    <div class="column-chart ${ (this.data.length == 0) ? 'column-chart_loading': '' }" style="--chart-height: ${ this.chartHeight }">
			        <div class="column-chart__title">
			            Total ${this.label}
			            <a href="${this.link}" class="column-chart__link">View all</a>
			        </div>
			        <div class="column-chart__container">
			            <div data-element="header" class="column-chart__header">
			            	${ this.formatHeading ? this.formatHeading(this.value.toLocaleString("en-US")) : this.value }
			            </div>
			            <div data-element="body" class="column-chart__chart">

							${this.data.map((value) => `
								<div style="--value: ${value}" data-tooltip="${Math.round((value / maxValue) * 100)}%"></div>
								` ).join('')}
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

   update(newData) {
   	this.data = newData;
   }
}
