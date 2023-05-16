class ToRgb {
  constructor(section, options) {
    this.section = section;
    this.options = options;
    this.data = {
      hex: "hex",
      rgb: "rgb"
    }
  }

  init() {
    if (!this.section) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.hexValues = [];
  }

  events() {
    this.getHexValues(this.options, this.data.hex);
    this.toRgb();
  }

  getHexValues(props, char) {
    for (const [key, value] of Object.entries(props)) {
      if (key.includes(char)) {
        this.hexValues.push(value);
      }
    }

    return this.hexValues;
  }


  // convert the color of css var to RGB
  toRgb() {
    const hexToRgb = hex =>
      hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
              ,(m, r, g, b) => '#' + r + r + g + g + b + b)
              .substring(1).match(/.{2}/g)
              .map(x => parseInt(x, 16))

    this.hexValues.forEach(item => {
      const hex = getComputedStyle(this.section)
            .getPropertyValue(item).trim();

      const rgb = `${hexToRgb(hex)}`;

      this.section.style.setProperty(`${item}-${this.data.rgb}`, `${rgb}`);
    })
  }
}

window.ToRgb = ToRgb
