export default class SortableList {

  constructor(props) {
    this.items = props.items;
    this.element = document.createElement('ul');
    this.element.classList.add("sortable-list");
    this.items.forEach(item => {
      item.classList.add("sortable-list__item");
      this.element.append(item);
    });

    this.subElements = {
      grabHandle: this.element.querySelector('[data-grab-handle]'),
      deleteHandle: this.element.querySelector('[data-delete-handle]'),
    };

    this.element.addEventListener('pointerdown', event => this.onMouseDown(event));
  }

  onMouseDown(event) {

    this.draggable = event.target.closest(".sortable-list__item");

    if (event.target.dataset.hasOwnProperty('deleteHandle')) { this.draggable.remove(); }

    if (!event.target.dataset.hasOwnProperty('grabHandle')) { return; }

    this.shiftX = event.clientX - this.draggable.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.draggable.getBoundingClientRect().top;

    this.placeholder = document.createElement('li');
    this.placeholder.classList.add("sortable-list__placeholder");
    this.placeholder.style.height = this.draggable.getBoundingClientRect().height + 'px';
    this.placeholder.style.width = this.draggable.getBoundingClientRect().width + 'px';

    if (this.element.lastElementChild === this.draggable) {
      this.draggable.previousSibling.insertAdjacentElement('afterend', this.placeholder);
      
    } else {
      this.draggable.nextSibling.insertAdjacentElement('beforebegin', this.placeholder);
    }

    this.draggable.style.position = 'absolute';
    this.draggable.style.zIndex = 1000;

    this.moveAt(event.pageX, event.pageY);

    this.element.append(this.draggable);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

  }

  onMouseMove = event => {
    this.moveAt(event.pageX, event.pageY);

    this.draggable.hidden = true;
    let below = document.elementFromPoint(event.clientX, event.clientY);
    this.draggable.hidden = false;

    if (!below) { return; }

    const droppable = below.closest('.sortable-list__item');

    if (!droppable) { return; }

    const droppablePosition = droppable.getBoundingClientRect().top;
    const placeholderPosition = this.placeholder.getBoundingClientRect().top;

    if (placeholderPosition > droppablePosition) {
      droppable.insertAdjacentElement('beforebegin', this.placeholder);
      
    } else {
      droppable.insertAdjacentElement('afterend', this.placeholder);
    }
  }

  onMouseUp = event => {
    document.removeEventListener('mousemove', this.onMouseMove);

    this.placeholder.insertAdjacentElement('afterend', this.draggable);

    this.draggable.removeEventListener('mouseup', this.onMouseUp);
    this.draggable.style = '';
    this.placeholder.remove();
  }

  moveAt(pageX, pageY) {
    this.draggable.style.left = pageX - this.shiftX + 'px';
    this.draggable.style.top = pageY - this.shiftY + 'px';
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();

    this.element.removeEventListener('pointerdown', this.onMouseDown);
    this.element.removeEventListener('mousemove', this.onMouseMove);
    this.element.removeEventListener('mouseup', this.onMouseUp);
  }
}
