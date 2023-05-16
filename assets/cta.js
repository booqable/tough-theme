class Cta {
  constructor(block) {
    this.block = block;
    this.options = {
      hexBackground: "--color-primary-background",
      hexAccent: "--color-accent-background",
    }
  }

  init() {
    if (!this.block) return false;

    const init = new window.ToRgb(this.block, this.options);
    init.init();
  }
}

((el = ".cta__wrapper") => {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(val => {
    const cta = new Cta(val);
    cta.init();
  });
})();
