export default class RangePicker {

  constructor(props = {}) {

    this.from = props.from;
    this.to = props.to;

    this.selected = this.getRangeISOStringDatesArray(this.from, this.to)

    this.element = this.createElement();

    this.trigger = true;
    this.initSelector = true;

    this.subElements = {
      input: this.element.querySelector('[data-element="input"]'),
      selector: this.element.querySelector('.rangepicker__selector'),
    }

    this.subElements.input.addEventListener('click', this.onInputClick);
    this.subElements.input.addEventListener('click', this.onInputClick);
    this.subElements.selector.addEventListener('click', this.onSelectorControlClick);
  }

  onInputClick = (event) => {
    this.element.classList.toggle("rangepicker_open")

    if (this.initSelector) {
      this.updateSelector()
      this.initSelector = false;
    }

    if (this.trigger) {
      this.updateInput();
    }
  }

  onSelectorControlClick = (event) => {

    if (event.target.className == 'rangepicker__selector-control-right') {
      this.to.setMonth(this.to.getMonth() + 1);
      this.updateCalendars()

    } else if (event.target.className == 'rangepicker__selector-control-left') {
      this.to.setMonth(this.to.getMonth() - 1);
      this.updateCalendars()

    } else if (event.target.classList.contains("rangepicker__cell")) {

      if (this.trigger) {
        this.selected = []

        this.trigger = false;
        this.from = new Date(event.target.getAttribute('data-value'));

        document.querySelectorAll('[type="button"]').forEach((element) => {
          element.classList.remove('rangepicker__selected-between')});
        
      } else {

        this.trigger = true;
        this.to = new Date(event.target.getAttribute('data-value'));

        this.selected = this.getRangeISOStringDatesArray(this.from, this.to)
        this.updateCalendars()

      }
    }
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return (`
<div class="container">
    <div class="rangepicker">
      ${ this.createRangepickerInput() }
      ${this.createRangepickerSelector() } 
    </div>
</div>`)
  }

  createRangepickerTemplate = () => `
      <div class="rangepicker">
      ${ this.createRangepickerInput() }
      ${this.createRangepickerSelector() } 
    </div>`

  createRangepickerSelector = () => `        
        <div class="rangepicker__selector" data-element="selector">${  this.initSelector ?  this.createRangepickerSelectorInner() :  ''}</div>`

  createRangepickerInput = () => `        
        <div class="rangepicker__input" data-element="input">
          <span data-element="from">${ this.from.toLocaleDateString() }</span> -
          <span data-element="to">${ this.to.toLocaleDateString() }</span>
        </div>`
  createRangepickerInputInner = () => `
          <span data-element="from">${ this.from.toLocaleDateString() }</span> -
          <span data-element="to">${ this.to.toLocaleDateString() }</span>`
  createRangepickerControlsTemplate = () =>
    `<div class="rangepicker__selector-arrow"></div>
          <div class="rangepicker__selector-control-left"></div>
          <div class="rangepicker__selector-control-right"></div>`
  createRangepickerSelectorInner() {
    return (`${this.createRangepickerControlsTemplate()}  
    <div class="rangepicker__calendar">${this.createRangepickerSelectorFirstCalendar()} </div> 
    <div class="rangepicker__calendar">${this.createRangepickerSelectorLastCalendar()} </div>`)
  }

  createRangepickerSelectorFirstCalendar = () => `
            ${ this.createHeaderRangepickerTemplate(this.getDateOneMonthBefore(this.to))}
            ${ this.createDateGridTemplate(this.getDateOneMonthBefore(this.to)) }     
     `
  createRangepickerSelectorLastCalendar = () => `
            ${ this.createHeaderRangepickerTemplate(this.to) }
            ${ this.createDateGridTemplate(this.to) }`

  getMonthName = (date) => date.toLocaleString('default', { month: 'long' })

  createMonthDatesTemplate = (date) => this.getRangeDatesArray(this.getFirstDayInMonth(date), this.getLastDayInMonth(date)).map((day) => `
              <button data-value="${ day.toLocaleDateString('fr-CA') }" type="button" class="rangepicker__cell ${(this.selected[this.selected.length - 1] == this.toOwnLocaleDateString(day) )? 'rangepicker__selected-to': '' }${ ((this.selected[0] == this.toOwnLocaleDateString(day) ))? 'rangepicker__selected-from': ''  }${ (this.selected.includes(this.toOwnLocaleDateString(day) ) && !((this.selected[0] == this.toOwnLocaleDateString(day) )||(this.selected[this.selected.length - 1] == this.toOwnLocaleDateString(day) )))? 'rangepicker__selected-between': ''}"${ day.getDate()==1 ? 'style="--start-from: '+ this.getFirstDayOfWeekInMonth(date) + '"':''}>${ day.getDate() }</button>`).join('')

  createDateGridTemplate = (date) => `            
  <div class="rangepicker__date-grid">
              ${ this.createMonthDatesTemplate(date) }
            </div>`

  getLastDayInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

  getFirstDayInMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)

  getFirstDayOfWeekInMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  getRangeDatesArray = (from, to) => Array.from({ length: (to - from) / (1000 * 3600 * 24) + 1 }, (value, index) => new Date(new Date(from).setDate(from.getDate() + index)))

  getRangeISOStringDatesArray = (from, to) => Array.from({ length: (to - from) / (1000 * 3600 * 24) + 1 }, (value, index) => this.toOwnLocaleDateString( new Date(new Date(from).setDate(from.getDate() + index))))

  getDateOneMonthBefore = (date) => new Date(new Date(date).setMonth(date.getMonth() - 1))

  toOwnLocaleDateString = (date) => date.toLocaleString().split(',')[0].split('.').reverse().join('-')

  createHeaderRangepickerTemplate = (date) => `
             <div class="rangepicker__month-indicator"><time datetime="December">${ this.getMonthName(date) }</time></div>
            <div class="rangepicker__day-of-week">
              <div>Пн</div>
              <div>Вт</div>
              <div>Ср</div>
              <div>Чт</div>
              <div>Пт</div>
              <div>Сб</div>
              <div>Вс</div>
            </div>`

  updateSelector() {
    this.subElements.selector.innerHTML = this.createRangepickerSelectorInner();
  }

  updateCalendars() {
    this.subElements.selector.lastChild.previousElementSibling.innerHTML = this.createRangepickerSelectorFirstCalendar();
    this.subElements.selector.lastChild.innerHTML = this.createRangepickerSelectorLastCalendar();
  }

  updateInput() {
    this.subElements.input.innerHTML = this.createRangepickerInputInner();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
