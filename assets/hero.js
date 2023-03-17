const selectors = {
  slider: '.hero__slider',
  images: '.hero__images',
  navigation: '.hero__navigation',
  switchers: '.hero__pagination-item',
  switcherActive: '.hero__pagination-item.active'
}

const classes = {
  switcher: 'hero__pagination-item',
  active: 'active'
}

const props = {
  cssVar: '--color-hero-overlay-rgb',
  animationNext: 'tonext',
  animationStart: 'tostart',
  animationSnap: 'snap'
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

    this.slider = this.container.querySelector(selectors.slider);
    this.switchers = [...this.container.querySelectorAll(selectors.switchers)];
    this.switcherParent = [...this.switchers];
    this.navigation = [...this.container.querySelectorAll(selectors.navigation)];
    this.target = this.switchers[0].firstElementChild;
    this.interval = null;
  }

  initEvents() {
    this.convertHexToRgb();

    if (!this.slider) return null;

    this.activeSwitcher();
    document.addEventListener("click", this.toggleSwitcher.bind(this));
    this.slider.addEventListener("mouseenter", this.animationOff.bind(this));
    this.slider.addEventListener("mouseleave", this.animationOn.bind(this));
  }

  animationOff() {
    clearInterval(this.interval)

    this.navigation.forEach(element => {
      element.style.animationName = 'none'
    });
  }

  animationOn() {
    this.nextSwitcher();

    this.navigation.forEach((element, index, array) => {
      index !== array.length - 1
        ? element.style.animationName = `${props.animationNext}, ${props.animationSnap}`
        : element.style.animationName = `${props.animationStart}, ${props.animationSnap}`
    });
  }

  // trigger(el, eventType) {
  //   if (typeof eventType === 'string' && typeof el[eventType] === 'function') {
  //     el[eventType]();
  //   } else {
  //     const event =
  //       typeof eventType === 'string'
  //         ? new Event(eventType, {bubbles: true})
  //         : eventType;
  //     el.dispatchEvent(event);
  //   }
  // }

  activeSwitcher() {
    this.switchers.forEach(switcher => {
      switcher.classList.remove(classes.active);
      this.target.parentElement.classList.add(classes.active);
    })

    this.nextSwitcher();

  }

  nextSwitcher() {
    this.switcherActive = this.container.querySelector(selectors.switcherActive);

    // if (this.interval) return null;

    this.interval = setInterval(() => {
      let next;

      !this.switcherParent.slice(-1)[0].classList.contains(classes.active)
        ? next = this.switcherActive.nextElementSibling
        : next = this.switcherParent[0];

      if (next) {
        this.switcherActive.classList.remove(classes.active)
        next.classList.add(classes.active)
        this.switcherActive = next
      } else {
        clearInterval(this.interval)
      }
    }, 4000);
  }

  toggleSwitcher(e) {
    this.target = e.target;

    if (!this.target.parentElement.classList.contains(classes.switcher)) return null;

    clearInterval(this.interval)

    this.activeSwitcher();
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
