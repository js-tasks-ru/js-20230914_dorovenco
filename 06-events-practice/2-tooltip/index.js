class Tooltip {
  instance

  constructor() {

    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  render() {
  	this.element = this.createElement();
    document.body.append(this.element);
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return (`
  	<div class="tooltip">${ this.tooltip }</div>
  	`);
  }

  initialize() {
    document.addEventListener('pointerover', this.onPointerOverEvent);
    document.addEventListener('pointerout', this.onPointerOutEvent);
  }

  onPointerOverEvent = event => {
    if (event.target.hasAttribute('data-tooltip')) {
      this.tooltip = event.target.dataset.tooltip;
      document.addEventListener("mousemove", this.onPointerMove);
      this.render();
    }
  }

  onPointerOutEvent = event => {
    document.addEventListener("mousemove", this.onPointerMove);
    this.remove();

  }

  onPointerMove = event => {
    this.element.style.top = `${event.clientY}px`;
    this.element.style.left = `${event.clientX}px`;
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
    document.removeEventListener("mousemove", this.onPointerMove);
  }
}

export default Tooltip;
