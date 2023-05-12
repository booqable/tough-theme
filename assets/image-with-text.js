class ImageWithText {
  constructor(section) {
    this.section = section;
    this.options = {
      hex: "--color-primary-foreground"
    }
  }

  init() {
    if (!this.section) return false;

    const init = new window.ToRgb(this.section, this.options);
    init.init();
  }
}

((selector = ".image-text__wrapper") => {
  const sections = [...document.querySelectorAll(selector)];

  if (!sections.length) return false;

  sections.forEach(section => {
    const imageWithText = new ImageWithText(section);
    imageWithText.init();
  });
})();
