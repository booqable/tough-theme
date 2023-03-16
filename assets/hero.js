const selectors = {
  images: '.hero__images',
  slides: '.hero__navigation'
}

class Hero {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) return false;

    this.initElements();
    this.initEvents();
    this.convertHexToRgb();
    this.inViewPort();
  }

  initElements() {
    this.images = [...this.container.querySelectorAll(selectors.images)];
    this.slides = [...this.container.querySelectorAll(selectors.slides)];
    this.color = null;
    this.timer = 0;
  }

  initEvents() {
  }

  myTimer() {
    console.log('my timer')
  }

  inViewPort() {
    if (!this.slides.length) return false;

    this.slides.forEach((slide, i) => {

      // slide.addEventListener('animationend', function(e) {
      //   console.log('ended');
      //   clearInterval(slide.interval);
      //   this.timer = 0;
      // });


      slide.addEventListener('animationstart', function(e) {
        console.log('started');
        this.timer = 4000;

        const myTimer = () => {
          console.log('my timer')
        }

        setInterval(myTimer(), this.timer);
        // console.log(myTimer())
      });

      // slide.addEventListener('onanimate', function(e) {
      //   console.log(e.timeStamp);
      // });

    // });




      // let bounding = slide.getBoundingClientRect();

      // console.log(i);

      // this.timer = setInterval(() => {
      //   if (bounding.top >= 0
      //       && bounding.left >= 0
      //       && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      //       && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {

      //       console.log(i + ' Element is in the viewport!');
      //   } else {

      //     console.log(i + ' Element is NOT in the viewport!');
      //   }
      // }, 4000);

    })
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
        '--color-hero-overlay-rgb',
        `${hexToRgb(this.color)}`
      );
    })
  }
}

const hero = new Hero(document.querySelector('.hero'));

hero.init();
