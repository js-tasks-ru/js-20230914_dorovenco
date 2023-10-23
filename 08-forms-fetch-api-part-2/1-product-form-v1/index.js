import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

const CATEGORY_URL = 'api/rest/categories?_sort=weight&_refs=subcategory';
const PRODUCT_URL = 'api/rest/products';

export default class ProductForm {
  constructor(productId) {

    this.productId = productId;

    this.categoryUrl = new URL(CATEGORY_URL, BACKEND_URL);
    this.productUrl = new URL(PRODUCT_URL, BACKEND_URL);

    if (this.productId) {
      this.productUrl.searchParams.set('id', this.productId);
    }

    this.productUpdatedEvent = new CustomEvent('product-updated');
    this.productSavedEvent = new CustomEvent('product-saved');

  }

  async load(productId) { return { categories: await fetchJson(this.categoryUrl), product: await fetchJson(this.productUrl) }; }

  async render() {

    this.data = await this.load(this.productId);
    this.element = this.createElement();
    this.subElements = { 
    	productForm: this.element.querySelector('[data-element="productForm"]'),
    	imageListContainer: this.element.querySelector('[data-element="imageListContainer"]'),
    };
    this.subElements.productForm.addEventListener('submit', this.onSubmit);
    
    return this.element
  }

  onSubmit = event => {
    event.preventDefault();
    this.save();
  }


  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {

    const { categories, product } = this.data;

    return (`
  <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value = '${product[0].title}'>
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${product[0].description}</textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">

        <ul class="sortable-list">
        ${ this.getImages() }
         </ul>

          </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
          ${ this.getOptions(categories) }
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100" value="${this.data.product[0].price}">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.data.product[0].discount}">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.data.product[0].quantity}">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          ${ this.getStatus() }
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>`);
  }

  getOptions = (categories) => categories.map(category => this.getSubcategories(category.subcategories, category.title)).join('');

  getSubcategories = (subcategories, categoryTitle) => subcategories.map(subcategory => `<option value="${ subcategory.id }">${ categoryTitle } &gt; ${ subcategory.title }</option>`).join('');

  getStatus = () => this.data.product[0].status ? `<option value='1' selected>Активен</option><option value='0'>Не активен</option>` : `<option value='1'>Активен</option><option value='0' selected>Не активен</option>`

  getImages = () => this.data.product[0].images.map(image => `<li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${image.url}">
            <input type="hidden" name="source" value="${image.source}">
            <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
            <span>${image.source}</span></span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle="" alt="delete">
            </button>
           </li> `).join('');

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  async save() {

    fetchJson(this.productUrl, {
      method: this.data.product[0].id ? 'PATCH' : "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.data.product[0])
    });

    try { this.productId ? this.element.dispatchEvent(this.productUpdatedEvent) : this.element.dispatchEvent(this.productSavedEvent) } 
    catch { throw new Error("Error saving/updating product"); }
  }

}
