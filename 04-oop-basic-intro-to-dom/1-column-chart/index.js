export default class ColumnChart {
  element;
  chartHeight = 50;
  constructor(props = {}) {

    const {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = (value) => value,
    } = props;

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;


    this.element = this.createElement();
    this.subElements = { body: this.element.querySelector('[data-element="body"]'), };

  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }


  createTemplate() {

    const maxValue = Math.max([...this.data]);

    return (
      `
			    <div class="column-chart ${ (this.data.length == 0) ? 'column-chart_loading' : '' }" style="--chart-height: ${ this.chartHeight }">
			        <div class="column-chart__title">
			            Total ${this.label}
			            <a href="${this.link}" class="column-chart__link">View all</a>
			        </div>
			        <div class="column-chart__container">
			            <div data-element="header" class="column-chart__header">
			            	${ this.formatHeading ? this.formatHeading(this.value.toLocaleString("en-US")) : this.value }
			            </div>
			            <div data-element="body" class="column-chart__chart">

							${ this.createColumnsPropsTemplate() }
			            </div>
			        </div>
			    </div>
   			`
    );

  }

  createColumnsPropsTemplate = () => this.getColumnProps(this.data).map(({value, percent}) => 
    `
                <div style="--value: ${value}" data-tooltip="${percent}"></div>
                `).join('') 

  remove() {
    this.element.remove();

  }

  destroy() {
    this.remove();
  }

  render(container = document.body) {
    container.appendChild(this.element);
  }

  update(newData) {
    this.data = newData;
    this.subElements.body.innerHTML = this.createColumnsPropsTemplate();
  }

}