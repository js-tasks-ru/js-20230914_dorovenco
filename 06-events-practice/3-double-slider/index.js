export default class DoubleSlider {

  constructor({
    min,
    max,
    formatValue = value => '$' + value,
    selected = { from: min, to: max }
  } = {}) {
    this.percent;
    this.side = '';

    this.left;
    this.right;

    this.selectedFrom = selected.from;
    this.selectedTo = selected.to;

    this.min = min;
    this.max = max;

    this.element = this.createElement();

    this.element.addEventListener('pointerdown', this.onPointerDownEvent);

    document.addEventListener('pointerup', this.onPointerUp);

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
    <span data-element="from">$${this.min}</span>
    <div class="range-slider__inner">
     ${ this.createSliderPropsTemplate('left', 100*((this.selectedFrom - this.min)/(this.max-this.min))) } 
     ${ this.createSliderProgressPropsTemplate(100*((this.selectedFrom - this.min)/(this.max-this.min)), 100*((this.selectedTo - this.min)/(this.max-this.min))) }
     ${ this.createSliderPropsTemplate('right', 100*((this.selectedTo - this.min)/(this.max-this.min))) }
    </div>
    <span data-element="to">$${this.max}</span>
  </div>
          `)
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

    console.log(event.clientX)

    if (percent < 0) { percent = 0 }
    if (percent > 100) { percent = 100 }

    this.update(percent)
  }

  onPointerUp = () => {
    this.element.removeEventListener('pointermove', this.onPointerMove);
  }

  update(percent) {

    let roundedPercent = Math.round(percent);

    if (this.side == 'left') {

      this.left = roundedPercent;

      if ((this.left + this.right) > 100) {
        this.left = 100 - this.right;

      }

      this.subElements[this.side + 'Slider'].style.left = this.left + '%';
      this.subElements.progressSlider.style.left = this.left + '%';
      this.element.firstElementChild.innerHTML = '$' + (this.min + roundedPercent * (this.max - this.min) / 100);

    } else if (this.side == 'right') {

      this.right = 100 - roundedPercent;

      if ((this.left + this.right) > 100) {
        this.right = 100 - this.left;
      }

      this.subElements[this.side + 'Slider'].style.right = this.right + '%';
      this.subElements.progressSlider.style.right = this.right + '%';
      this.element.lastElementChild.innerHTML = '$' + (this.min + roundedPercent * (this.max - this.min) / 100);
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
  }
}
