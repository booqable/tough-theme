const val = {
  load: "loaded",
  res: "resize-active"
};

const vars = {
  hex: "--color-primary-foreground",
  rgb: "--color-primary-foreground-rgb"
}

class Main {
  constructor(container) {
    this.cnt = container;
  }

  init() {
    if (!this.cnt) {
      return false;
    }

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
    this.tmr = undefined;
  }

  events() {
    this.setClass();
    this.toRgb();
    window.addEventListener("resize", this.setResize.bind(this));
  }

  // adding class while resizing window
  setResize() {
    this.cnt.classList.add(val.res);
    clearTimeout(this.tmr);

    this.tmr = setTimeout(() => {
      this.cnt.classList.remove(val.res);
    }, 500);
  }

  // adding class after loading content
  setClass() {
    this.cnt.classList.add(val.load);
  }

  // convert the color of primary css var to RGB
  toRgb() {
    const hexToRgb = hex =>
      hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

    const hex = getComputedStyle(this.doc)
                  .getPropertyValue(vars.hex).trim();

    const rgb = `${hexToRgb(hex)}`

    this.doc.style.setProperty(
                    `${vars.rgb}`,
                    `${rgb}`
                  );
  }
}

const main = new Main(document.querySelector('body'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") main.init();
});
