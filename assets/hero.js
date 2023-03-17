const selectors = {
  images: '.hero__images'
}

const props = {
  cssVar: '--color-hero-overlay-rgb'
}

class Hero {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) return false;

    this.initElements();
    this.initEvents();
  }

  initElements() {
    this.images = [...this.container.querySelectorAll(selectors.images)];
    this.color = null;
  }

  initEvents() {
    this.convertHexToRgb();
  }

  convertHexToRgb() {
    if (!this.images.length) return false;

    const hexToRgb = hex =>
      hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

    this.images.forEach(image => {
      let data = image.getAttribute('style'),
          dataObj = data.split(';').reduce((obj, str, index) => {
            let strParts = str.split(':');

            if (strParts[0] && strParts[1]) {
              obj[strParts[0].replace(/\s+/g, '')
                            .replace('--', '')
                            .replaceAll('-', '_')] = strParts[1].trim();
            }
            return obj;
          }, {});

      this.color = dataObj.color_hero_overlay;

      image.style.setProperty(
        `${props.cssVar}`,
        `${hexToRgb(this.color)}`
      );
    })
  }
}

const hero = new Hero(document.querySelector('.hero'));

hero.init();
