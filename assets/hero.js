class Hero {
  constructor(section) {
    this.section = section;

    this.selector = {
      image: ".hero__images",
      button: ".carousel__trigger",
      timer: ".carousel__timer"
    }

    this.classes = {
      next: "next"
    }

    this.id = {
      slide: "slide"
    }

    this.options = {
      hex: "--color-primary-foreground",
      rgb: "--color-primary-foreground-rgb"
    }

    this.current = 1
  }

  init() {
    if (!this.section) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.images = [...this.section.querySelectorAll(this.selector.image)];
    this.buttons = [...this.section.querySelectorAll(this.selector.button)];
    this.timer = this.section.querySelector(this.selector.timer);
  }

  events() {
    this.toRgb();
    this.event();
    this.autoRotate();
  }

  toRgb() {
    if (!this.images.length) return false;

    this.images.forEach(image => {
      const init = new window.ToRgb(image, this.options);
      init.init();
    })
  }

  autoRotate() {
    const timer = this.timer.value * 1000;

    if (timer === 0 ) return false;

    const interval = setInterval(() => {
      this.event()
    }, timer)

    return () => {
      clearInterval(interval)
    }
  }

  event() {
    if (!this.buttons.length) return false;

    const toggler = document.querySelector(`#${this.id.slide}-${this.current}`)

    toggler.click();

    this.current === this.buttons.length
      ? this.current = 1
      : this.current += 1
  }
}

function initHero(selector = ".hero") {
  const sections = [...document.querySelectorAll(selector)];

  if (!sections.length) return false;

  sections.forEach(section => {
    const hero = new Hero(section);
    hero.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initHero()
});
