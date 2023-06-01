class ContactForm {
  constructor(block) {
    this.block = block;

    this.selector = {
      wrap: ".contact-form__wrapper"
    }

    this.options = {
      hex: "--color-primary-foreground"
    }
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.wrap = this.block.querySelector(this.selector.wrap);
  }

  events() {
    this.toRgb();
  }

  toRgb() {
    const init = new window.ToRgb(this.wrap, this.options);
    init.init();
  }
}

((el = ".contact-form") => {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(val => {
    const instance = new ContactForm(val);
    instance.init();
  });
})();
