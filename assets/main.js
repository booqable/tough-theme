const modificators = {
  loaded: "loaded",
  resizeClass: "resize-active"
};

class Main {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) {
      return false;
    }

    this.timer = undefined;

    this.setLoadedClass();
    window.addEventListener("resize", this.setResizeClass.bind(this));
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

const main = new Main(document.querySelector('body'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") main.init();
});
