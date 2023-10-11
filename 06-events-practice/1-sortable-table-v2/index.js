import { SortableTable as SortableTableV1 } from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {

  arrow

  constructor(headerConfig, {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {

    super(headerConfig, data);

    this.subElements = {
      body: this.element.querySelector('[data-element="body"]'),
      header: this.element.querySelector('[data-element="header"]'),
    };

    this.subElements.header.addEventListener("pointerdown", this.sortOnClick);

    this.sorted = sorted;

    this.arrow = this.createArrow();

    const sortedHeaderSelector = '[data-id=' + this.sorted.id + ']';

    this.subElements.header.querySelector(sortedHeaderSelector).append(this.createArrow());
  }

  createArrow() {
    const element = document.createElement('div');
    element.innerHTML = this.createArrowTemplate();
    return element.firstElementChild;
  }

  createArrowTemplate() {
    return (
      `<span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`
    );
  }

  sortOnClick = (event) => {
    const targetCell = event.target.closest(".sortable-table__cell");

    if (SortableTable.arrow) {
      SortableTable.arrow.remove();
    }

    targetCell.append(this.arrow);

    SortableTable.arrow = this.arrow;

    if (targetCell.dataset.sortable === "true") {
      const field = targetCell.dataset.id;
      const order = targetCell.dataset.order === "desc" ? "asc" : "desc";

      this.sort(field, order);
    }
  }

  destroy() {
    super.destroy();
    this.subElements.header.removeEventListener("pointerdown", this.sortOnClick);
  }
}
