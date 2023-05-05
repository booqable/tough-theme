class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      navi: ".carousel__navigation",
      pagination: ".carousel__pagination",
      button: ".carousel__button",
      bullet: ".carousel__bullet",
      wrapper: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer",
      count: ".carousel__count"
    }

    this.classes = {
      show: "show",
      fade: "carousel__fade-effect",
      pause: "carousel__pause",
      button: "carousel__button",
      bullet: "carousel__bullet",
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
    this.buttons = [...this.block.querySelectorAll(this.selector.button)];
    this.bullets = [...this.block.querySelectorAll(this.selector.bullet)];
    this.count = this.block.querySelector(this.selector.count);
    this.timer = this.block.querySelector(this.selector.timer).value * 1000;
    this.interval;
  }

  events(e) {
    this.carouselInit();
    this.autoRotate(e, this.timer);
    this.pauseAutoRotate();
    this.controls();

    this.listener(this.bullets, 'click', this.pagination)
    this.listener(this.bullets, 'click', this.navigation)
    this.listener(this.buttons, 'click', this.navigation)
    window.addEventListener("resize", this.controls.bind(this));
  }

  listener(arr, event, call) {
    arr.forEach(el => {
      el.addEventListener(`${event}`, call.bind(this));
    })
  }

  carouselInit() {
    if (this.items.length < 2) return false;

    this.block.classList.add(this.classes.init);
  }

  // change slides in Fade effect mode
  fadeEffect(val) {
    const isEl = this.block.classList.contains(this.classes.fade);

    if (!isEl) return false;
    if (typeof val === 'undefined') return false;

    this.items.forEach((el, i) => {
      el.classList.replace(this.modifiers.show, this.modifiers.hide);
      if (i + 1 === val) el.classList.replace(this.modifiers.hide, this.modifiers.show);
    })
  }

  // autorotate slides of carousel
  autoRotate(e, time) {
    if (time === 0 || typeof time === 'undefined') return false;

    this.interval = setInterval(() => {
      this.navigation(e, time)
    }, time)

    return () => {
      clearInterval(this.interval)
    }
  }

  // pause autorotate slides on hover and touch devices
  pauseAutoRotate() {
    const isEl = this.block.classList.contains(this.classes.pause);

    if (!isEl) return false;
    if (!this.items.length) return false;

    const event = e => {
      if(e.type === "mouseenter" || e.type === "touchstart") clearInterval(this.interval)
      if(e.type === "mouseleave" || e.type === "touchend") this.autoRotate(e, this.timer)
    }

    this.block.addEventListener('mouseenter', event);
    this.block.addEventListener('mouseleave', event);
    this.block.addEventListener('touchstart', event);
    this.block.addEventListener('touchend', event);
  }

  // change active bullet of the pagination
  pagination(e, i) {
    const target = e?.target,
          isEl = target?.classList.contains(this.classes.bullet);

    if (!isEl && typeof i === 'undefined') return false;

    this.bullets.forEach(el => {
      const val = parseInt(el.getAttribute(this.data.index));

      el.classList.remove(this.modifiers.active);

      if (isEl) target.classList.add(this.modifiers.active);
      if (val === i) el.classList.add(this.modifiers.active);
      if (typeof i === 'undefined') i = parseInt(target.getAttribute(this.data.index));
    })

    this.counter(e, i);
    this.fadeEffect(i);
  }

  // slide the carousel left/right and change the index of the active bullet of the pagination
  navigation(e, t) {
    const target = e?.target,
          isBullet = target?.classList.contains(this.classes.bullet),
          isNav = target?.classList.contains(this.classes.button),
          isFade = this.block.classList.contains(this.classes.fade);

    if (!isNav && !isBullet && t === 0 && typeof t === 'undefined') return false;

    const list = target?.classList,
          width = this.item.getBoundingClientRect().width,
          scroll = this.wrap.scrollWidth,
          client = this.wrap.clientWidth,
          index = parseInt(target?.getAttribute(this.data.index)),
          children = [...this.wrap.children];

    let val,
        i,
        left = this.wrap.scrollLeft;

    if (list?.contains(this.classes.prev)) {
      if (!isFade) {
        left === 0
          ? i = Math.ceil((scroll - client) / width +1)
          : i = Math.ceil(left / width),
        this.pagination(e, i),
        val = left === 0 ? scroll : left - width

      } else {
        children.forEach((el, ind) => {
          if (el.classList.contains(this.classes.show)) {
            ind === 0 ? i = this.items.length : i = ind;
          }
        })

        this.pagination(e, i);
        this.fadeEffect(i)
      }
    }

    if (list?.contains(this.classes.next)) {
      if (!isFade) {
        left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
        this.pagination(e, i)

        val = left >= scroll - client ? left = 0 : left + width;
      } else {
        children.forEach((el, ind) => {
          if (el.classList.contains(this.classes.show)) {
            ind + 1 === this.items.length ? i = 1 : i = ind + 2;
          }
        })

        this.pagination(e, i);
        this.fadeEffect(i)
      }
    }

    if (list?.contains(this.classes.bullet)) !isFade ? val = width * (index - 1) : null;

    if (t !== 0 && typeof t !== 'undefined') {
      if (this.items.length < 2) return false;

      if (!isFade) {
        left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
        this.pagination(e, i)

        val = left + client >= scroll ? left = 0 : left += width
      } else {
        children.forEach((el, ind) => {
          if (el.classList.contains(this.classes.show)) {
            ind + 1 === this.items.length ? i = 1 : i = ind + 2;
          }
        })

        this.pagination(e, i);
        this.fadeEffect(i)
      }
    }

    if (!isFade) this.scrollTo(val);
  }

  // change index of counter of slides
  counter(e, i) {
    if (!this.count) return false;

    if (i === 0 || typeof i === 'undefined') return false;

    let num = "";

    if (i < 10) num = 0

    this.count.innerHTML = `${num}${i}`
  }

  scrollTo(val) {
    this.wrap.scrollTo({
      left: val,
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
  if (e.target.readyState === "complete") initCarousel()
});
