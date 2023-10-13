export default class RangePicker {

  constructor(props = {}) {

    this.from = props.from;
    this.to = props.to;

    this.element = this.createElement();

    this.subElements = {
      input: this.element.querySelector('[data-element="input"]'),
      selector: this.element.querySelector('[data-element="selector]'),
    }

    this.subElements.input.addEventListener("pointerdown", this.onClick);

  }

  onClick = (event) => {

    this.element.classList.toggle("rangepicker_open");

  }

  updateSelector() {
    this.subElements.selector.innerHTML = this.createRangepickerSelector();
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return (
      `
  <div class="container">
  <div class="rangepicker">

  	${ this.createRangepickerInput() }

  	${ this.createRangepickerSelector() }
   
    </div>
  </div>
</div>
    	    	`)
  }

  createRangepickerInput = () =>

    `    
    <div class="rangepicker__input" data-element="input">
      <span data-element="from">${ this.from.toLocaleDateString() }</span> -
      <span data-element="to">${ this.to.toLocaleDateString() }</span>
    </div>`

  createRangepickerSelector = () =>

    `<div class="rangepicker__selector" data-element="selector">
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>

      ${ this.createHeaderRangepickerTemplate(this.from) }

      ${ this.createDateGridTemplate(this.from) }
      
      </div>

      ${ this.createHeaderRangepickerTemplate(this.to) }

   		${ this.createDateGridTemplate(this.to) }
      </div>`

  getMonthName = (date) => date.toLocaleString('default', { month: 'long' })[0].toUpperCase() + date.toLocaleString('default', { month: 'long' }).slice(1)

  createMonthDatesTemplate = (date) => Array(this.getLastDayInMonth(date)).fill().map((x, i) => i + 1).map((day) => `<button type="button" class="rangepicker__cell"${ day==1 ? 'style="--start-from: '+ this.getFirstDayOfWeekInMonth(date) + '"':''} data-value="${ day }">${ day }</button>`).join('')

  getLastDayInMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 0).getDate()

  getFirstDayOfWeekInMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  createDateGridTemplate = (date) =>
    `
        <div class="rangepicker__date-grid">
        ${ this.createMonthDatesTemplate(date) }
        </div>
  `

  createHeaderRangepickerTemplate = (date) =>
    `
        <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="December">${ this.getMonthName(date) }</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
  `

  remove() {
    this.element.remove();

  }

  destroy() {
    this.remove();
  }

  render(container = document.body) {
    container.appendChild(this.element);
  }

}
