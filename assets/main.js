const modificators = {
  loaded: "loaded",
  resizeClass: "resize-active"
};

class Primary {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) {
      return false;
    }

    this.initElements();
    this.initEvents();
  }

  initElements() {
    this.timer = undefined;
  }

  initEvents() {
    window.addEventListener("resize", this.setResizeClass.bind(this));
    window.addEventListener("DOMContentLoaded", this.setLoadedClass.bind(this));
  }

  // adding class while resizing window
  setResizeClass() {
    this.container.classList.add(modificators.resizeClass);
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.container.classList.remove(modificators.resizeClass);
    }, 500);
  }

  // adding class after loading content
  setLoadedClass() {
    this.container.classList.add(modificators.loaded);
  }
}

const primary = new Primary(document.querySelector('body'));

primary.init();
