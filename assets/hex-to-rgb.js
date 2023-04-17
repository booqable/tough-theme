
class ToRgb {
  constructor(section, options) {
    this.section = section;
    this.options = options;
  }

  init() {
    if (!this.section) return false;

    this.toRgb();
  }

  // convert the color of css var to RGB
  toRgb() {
    const hexToRgb = hex =>
      hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
              ,(m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

    const hex = getComputedStyle(this.section)
                .getPropertyValue(this.options.hex).trim();

    const rgb = `${hexToRgb(hex)}`;

    this.section.style.setProperty(`${this.options.rgb}`, `${rgb}`);
  }
}

window.ToRgb = ToRgb
