class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      navi: ".carousel__navigation",
      pagination: ".carousel__pagination",
      btn: ".carousel__btn",
      dot: ".carousel__dot",
      wrapper: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer",
      count: ".carousel__count"
    }

    this.classes = {
      show: "show",
      fluid: "carousel__fluid",
      fade: "carousel__fade-effect",
      pause: "carousel__pause",
      btn: "carousel__btn",
      dot: "carousel__dot",
      hidden: "hidden",
      prev: "prev",
      next: "next",
      init: "initialized"
    }

    this.modifiers = {
      active: "active",
      show: "show",
      hide: "hide"
    }

    this.data = {
      index: "data-index"
    };

    this.query = 992;
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.wrap = this.block.querySelector(this.selector.wrapper);
    this.navi = this.block.querySelector(this.selector.navi);
    this.pagi = this.block.querySelector(this.selector.pagination);
    this.item = this.block.querySelector(this.selector.item);
    this.items = [...this.block.querySelectorAll(this.selector.item)];
    this.btns = [...this.block.querySelectorAll(this.selector.btn)];
    this.dots = [...this.block.querySelectorAll(this.selector.dot)];
    this.count = this.block.querySelector(this.selector.count);
    this.timer = this.block.querySelector(this.selector.timer).value * 1000;
    this.interval;
  }

  events(e) {
    this.carouselInit();
    this.autoRotate(e, this.timer);
    this.pauseAutoRotate();
    this.controls();

    this.listener(this.dots, 'click', this.pagination);
    this.listener(this.dots, 'click', this.navigation);
    this.listener(this.btns, 'click', this.navigation);
    window.addEventListener("resize", this.controls.bind(this));
  }

  listener(arr, event, func) {
    arr.forEach(el => {
      el.addEventListener(`${event}`, func.bind(this));
    })
  }

  carouselInit() {
    if (this.items.length < 2) return false;

    this.block.classList.add(this.classes.init);
  }

  // change slides in Fade effect mode
  fadeClass(value) {
    const isEl = this.block.classList.contains(this.classes.fade);

    if (!isEl) return false;
    if (typeof value === 'undefined') return false;

    this.items.forEach((el, i) => {
      el.classList.replace(this.modifiers.show, this.modifiers.hide);
      if (i + 1 === value) el.classList.replace(this.modifiers.hide, this.modifiers.show);
    })
  }

  // autorotate slides of carousel
  autoRotate(e, time) {
    if (time === 0 || typeof time === 'undefined') return false;

    this.interval = setInterval(() => {
      this.navigation(e, time);
    }, time);

    return () => {
      clearInterval(this.interval);
    }
  }

  // pause autorotate slides on hover and touch devices
  pauseAutoRotate() {
    const isEl = this.block.classList.contains(this.classes.pause);

    if (!isEl) return false;
    if (!this.items.length) return false;

    const func = e => {
      if(e.type === "mouseenter" || e.type === "touchstart") clearInterval(this.interval);
      if(e.type === "mouseleave" || e.type === "touchend") this.autoRotate(e, this.timer);
    }

    this.block.addEventListener('mouseenter', func);
    this.block.addEventListener('mouseleave', func);
    this.block.addEventListener('touchstart', func);
    this.block.addEventListener('touchend', func);
  }

  // change active dot of the pagination
  pagination(e, i) {
    const target = e?.target,
          isEl = target?.classList.contains(this.classes.dot);

    if (!isEl && typeof i === 'undefined') return false;

    this.dots.forEach(el => {
      const value = parseInt(el.getAttribute(this.data.index));

      el.classList.remove(this.modifiers.active);

      if (isEl) target.classList.add(this.modifiers.active);
      if (value === i) el.classList.add(this.modifiers.active);
      if (typeof i === 'undefined') i = parseInt(target.getAttribute(this.data.index));
    })

    this.counter(e, i);
    this.fadeClass(i);
  }

  // slide the carousel left/right and change the index of the active dot of the pagination
  navigation(e, time) {
    const target = e?.target,
          isDot = target?.classList.contains(this.classes.dot),
          isNav = target?.classList.contains(this.classes.btn),
          isFade = this.block.classList.contains(this.classes.fade),
          isFluid = this.block.classList.contains(this.classes.fluid);

    if (!isNav && !isDot && time === 0 && typeof time === 'undefined') return false;

    const list = target?.classList,
          width = this.item.getBoundingClientRect().width,
          scroll = this.wrap.scrollWidth,
          client = this.wrap.clientWidth,
          index = parseInt(target?.getAttribute(this.data.index)),
          children = [...this.wrap.children];

    let value,
        i,
        left = this.wrap.scrollLeft;

    if (list?.contains(this.classes.prev)) {
      if (!isFade) {
        if (left === 0) {
          i = Math.ceil((scroll - client) / width + 1);

          if (isFluid && client < this.query) i -= 1;

          value = scroll;
        } else {
          i = Math.ceil(left / width);
          value = left - width;
        }

        this.pagination(e, i);

      } else {
        const options = {
          arr: children,
          equal: 0,
          last: this.items.length
        }

        this.fadeSlide(e, i, options);
      }
    }

    if (list?.contains(this.classes.next) || time !== 0 && typeof time !== 'undefined') {
      if (!isFade) {
        if (left >= scroll - client - 16) {
          i = 1;
          value = 0;
        } else {
          i = parseInt(left / width + 2);
          value = left + width;
        }

        this.pagination(e, i);

      } else {
        const options = {
          arr: children,
          equal: this.items.length,
          last: 1,
          nextNumber: 1,
          nextIndex: 2
        }

        this.fadeSlide(e, i, options);
      }
    }

    if (list?.contains(this.classes.dot) && !isFade) value = width * (index - 1);

    if (!isFade) this.scrollTo(value);
  }

  // search new index for active slide on Fade carousel mode
  fadeSlide(e, i, options) {
    const {arr, equal, last, nextNumber, nextIndex} = options;

    arr.forEach((el, index) => {
      if (el.classList.contains(this.classes.show)) {
        const condition = index + (nextNumber ?? 0);
        const next = index + (nextIndex ?? 0);

        condition === equal ? i = last : i = next
      }
    })

    this.pagination(e, i);
    this.fadeClass(i);
  }

  // change index of counter of slides
  counter(e, i) {
    if (!this.count) return false;

    if (i === 0 || typeof i === 'undefined') return false;

    let num = "";

    if (i < 10) num = 0;

    this.count.innerHTML = `${num}${i}`;
  }

  scrollTo(value) {
    this.wrap.scrollTo({
      left: value,
      behavior: "smooth",
    });
  }

  controls() {
    const width = this.item.getBoundingClientRect().width,
          client = this.wrap.clientWidth;

    width * this.items.length <= client
      ? (this.navi.classList.add(this.classes.hidden),
        this.pagi.classList.add(this.classes.hidden))
      : (this.navi.classList.remove(this.classes.hidden),
        this.pagi.classList.remove(this.classes.hidden))
  }
}

function initCarousel(el = ".carousel") {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(val => {
    const carousel = new Carousel(val);
    carousel.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initCarousel();
});
