class Hero {
  constructor(section) {
    this.section = section;
    this.options = {
      hex: "--color-primary-foreground",
      rgb: "--color-primary-foreground-rgb"
    }
  }

  init() {
    if (!this.section) return false;

    const init = new window.ToRgb(this.section, this.options);
    init.init();
  }
}

((selector = ".hero__images") => {
  const sections = [...document.querySelectorAll(selector)];

  if (!sections.length) return false;

  sections.forEach(section => {
    const hero = new Hero(section);
    hero.init();
  });
})();
