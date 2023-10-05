export default class NotificationMessage {

element;

constructor(message, props = {}) {
  const {
    duration = 20000,
    type = 'success',
  } = props;

  this.duration = duration;
  this.type = type;
  this.message = message;

  this.element = this.createElement();

}

createElement() {
  const element = document.createElement('div');
  element.innerHTML = this.createTemplate();
  return element.firstElementChild;
}

remove() {
  this.element.remove();

}

destroy() {
  this.remove();

  if (this.timerId) {
    clearTimeout(this.timerId);
  }

}

show(targetElement = document.body) {
  
  if (NotificationMessage.element) {
    NotificationMessage.element.remove();
  }

  targetElement.append(this.element);

  this.timerId = setTimeout(() => {
    this.destroy();
  }, this.duration);

  NotificationMessage.element = this;
}


createTemplate() { 
  return (
    `
  		<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">success</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>
  		`); 
}
}
