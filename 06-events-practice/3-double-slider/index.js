export default class DoubleSlider {

  constructor({
    min = 0,
    max = 100,
    formatValue = value => '$' + value,
    selected = { from: min, to: max }
  } = {}) {
    this.percent = '';
    this.side = '';

    this.left = '';
    this.right = '';

    this.min = min;
    this.max = max;

    this.formatValue = formatValue;

    this.selectedFrom = selected.from;
    this.selectedTo = selected.to;

    this.element = this.createElement();

    this.element.addEventListener('pointerdown', this.onPointerDownEvent);

    document.addEventListener('pointerup', this.onPointerUp);

    this.rangeSelectEvent = new CustomEvent('range-select', { bubbles: true, detail: { from: min, to: max } });

    this.subElements = {
      leftSlider: this.element.querySelector('span.range-slider__thumb-left'),
      rightSlider: this.element.querySelector('span.range-slider__thumb-right'),
      progressSlider: this.element.querySelector('span.range-slider__progress'),
    };

  }

  render() {}

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return (
      `
  <div class="range-slider">
    <span data-element="from">${this.formatValue(this.selectedFrom) }</span>
    <div class="range-slider__inner">
     ${ this.createSliderPropsTemplate('left', 100 * ((this.selectedFrom - this.min) / (this.max - this.min))) } 
     ${ this.createSliderProgressPropsTemplate(100 * ((this.selectedFrom - this.min) / (this.max - this.min)), 100 - 100 * ((this.selectedTo - this.min) / (this.max - this.min))) }
     ${ this.createSliderPropsTemplate('right', 100 - 100 * ((this.selectedTo - this.min) / (this.max - this.min))) }
    </div>
    <span data-element="to">${this.formatValue(this.selectedTo) }</span>
  </div>
          `);
  }

  createSliderPropsTemplate = (side, percent) => `<span class="range-slider__thumb-${ side }" style="${ side }: ${ percent }%"></span>`

  createSliderProgressPropsTemplate = (left, right) => `<span class="range-slider__progress" style="left: ${ left }%; right: ${ right }%"></span>`

  onPointerDownEvent = event => {

    let side = event.target.className.split('-').pop();

    if (side == 'left' || side == 'right') {

      this.side = side;
      this.baseCoords = this.element.querySelector('.range-slider__inner').getBoundingClientRect();
      this.percentStep = this.baseCoords.width / 100;
      this.element.addEventListener('pointermove', this.onPointerMove);

    }
  }

  onPointerMove = event => {

    let percent = Number((event.clientX - this.baseCoords.x) / this.percentStep);

    if (percent < 0) { percent = 0; }
    if (percent > 100) { percent = 100; }

    this.update(percent);
  }

  onPointerUp = () => {
    this.element.removeEventListener('pointermove', this.onPointerMove);

    this.rangeSelectEvent.detail.from = this.selectedFrom;
    this.rangeSelectEvent.detail.to = this.selectedTo;

    this.element.dispatchEvent(this.rangeSelectEvent);
  }

  update(percent) {

    const roundedPercent = Math.round(percent);
    const scale = (this.max - this.min) / 100;
    const roundedScaledPercent = this.min + Math.round(roundedPercent * scale);

    if (this.side == 'left') {

      this.left = roundedPercent;

      if ((this.left + this.right) > 100) {
        this.left = 100 - this.right;

      }

      this.subElements[this.side + 'Slider'].style.left = this.left + '%';
      this.subElements.progressSlider.style.left = this.left + '%';

      this.element.firstElementChild.innerHTML = '$' + roundedScaledPercent;
      this.selectedFrom = roundedScaledPercent;

    } else if (this.side == 'right') {

      this.right = 100 - roundedPercent;

      if ((this.left + this.right) > 100) {
        this.right = 100 - this.left;
      }

      this.subElements[this.side + 'Slider'].style.right = this.right + '%';
      this.subElements.progressSlider.style.right = this.right + '%';

      this.element.lastElementChild.innerHTML = '$' + roundedScaledPercent;
      this.selectedTo = roundedScaledPercent;

    }
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener("pointerout", this.onPointerOverEvent);
    document.removeEventListener("pointerover", this.onPointerOutEvent);
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("range-select", this.rangeSelectEvent);
  }
}
