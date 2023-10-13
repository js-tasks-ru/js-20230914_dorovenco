import fetchJson from './utils/fetch-json.js';

import { default as ColumnChartV1 } from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

export default class ColumnChart extends ColumnChartV1 {

  API = 'https://course-js.javascript.ru/'

  constructor(props = {}) {

    super(props);

    this.url = new URL(this.API + props.url);
    this.range = props.range;

  }

  async update(from = this.range.from, to = this.range.to) {

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    const response = await fetchJson(this.url);

    this.data = Object.values(response);

    this.subElements.body.innerHTML = this.createColumnsPropsTemplate();

    this.element.classList.remove('column-chart_loading');

    return response;

  }
}
