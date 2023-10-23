import fetchJson from './utils/fetch-json.js';

import { default as SortableTableV2 } from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    url = '',
    data = [],
    sorted = {},
    isSortLocally = false,

  } = {}) {

    super(headersConfig, data);
    this.url = new URL(url, BACKEND_URL);
    this.data = data;
    this.isSortLocally = isSortLocally;

    this.isSortLocally ? this.sortOnClient(this.sorted.id, this.sorted.order) : this.sortOnServer(this.sorted.id, this.sorted.order);

    this.subElements = {
      body: this.element.querySelector('[data-element="body"]'),
      header: this.element.querySelector('[data-element="header"]'),
    };

    this.subElements.header.addEventListener("pointerdown", this.sortOnClick);

  }

  async render() {
    this.isSortLocally ? await this.sortOnClient(this.sorted.id, this.sorted.order) : await this.sortOnServer(this.sorted.id, this.sorted.order);
  }

  async sortOnClient(id, order) {
    await this.loadData()
    this.sort(id, order)
  }

  async sortOnServer(id, order) {
    await this.loadSortedData(id, order)
    this.subElements.body.innerHTML = this.createTableRowsTemplate(this.data);
  }

  async loadData() {
    this.data = Object.values(await fetchJson(this.url));
  }

  async loadSortedData(sortColumnId, order) {
    this.url.searchParams.set('_sort', sortColumnId);
    this.url.searchParams.set('_order', order);
    this.data = Object.values(await fetchJson(this.url))
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

      this.isSortLocally ? this.sortOnClient(field, order) : this.sortOnServer(field, order);
    }
  }
}
