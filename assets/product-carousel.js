class Carousel {
  constructor(section) {
    this.section = section;

    this.selector = {

    }

    this.modificators = {
      loaded: "loaded",
      resizeClass: "resize-active"
    };
  }

  init() {
    if (!this.section) {
      return false;
    }

    this.elements();
    this.events();
  }

  elements() {
  }

  events() {
    // window.addEventListener("resize", this.setResizeClass.bind(this));
  }


}

function initCarousel(selector = ".products__carousel") {
  const sections = [...document.querySelectorAll(selector)];

  if (!sections.length) return false;

  sections.forEach(section => {
    const carousel = new Carousel(section);
    carousel.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initCarousel()
});
