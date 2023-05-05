class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      navi: ".carousel__navigation",
      pagination: ".carousel__pagination",
      bullet: ".carousel__bullet",
      wrapper: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer"
    }

    this.classes = {
      carousel: "carousel",
      bullet: "carousel__bullet",
      button: "carousel__button",
      hidden: "hidden",
      prev: "prev",
      next: "next"
    }

    this.modifiers = {
      active: "active"
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
    this.bullets = [...this.block.querySelectorAll(this.selector.bullet)];
    this.timer = this.block.querySelector(this.selector.timer).value * 1000;
    this.interval;
  }

  events(e) {
    this.autoRotate(e, this.timer);
    this.pauseRotate();
    this.controls();

    document.addEventListener("click", this.navigation.bind(this));
    document.addEventListener("click", this.pagination.bind(this));
    window.addEventListener("resize", this.controls.bind(this));
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
  pauseRotate() {
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
    })
  }

  // slide the carousel left/right and change the index of the active bullet of the pagination
  navigation(e, t) {
    const target = e?.target,
          isBullet = target?.classList.contains(this.classes.bullet),
          isNav = target?.classList.contains(this.classes.button);

    if (!isNav && !isBullet && t === 0 && typeof t === 'undefined') return false;

    const list = target?.classList,
          width = this.item.getBoundingClientRect().width,
          scroll = this.wrap.scrollWidth,
          client = this.wrap.clientWidth,
          index = parseInt(target?.getAttribute(this.data.index));

    let val,
        i,
        left = this.wrap.scrollLeft;

    if (list?.contains(this.classes.prev)) {
      left === 0 ? i = Math.ceil((scroll - client) / width + 1) : i = Math.ceil(left / width)
      this.pagination(e, i)

      val = left === 0 ? scroll : left - width;
    }

    if (list?.contains(this.classes.next)) {
      left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
      this.pagination(e, i)

      val = left >= scroll - client ? left = 0 : left + width;
    }

    if (list?.contains(this.classes.bullet)) val = width * (index - 1);

    if (t !== 0 && typeof t !== 'undefined') {
      if (this.items.length < 2) return false;

      left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
      this.pagination(e, i)

      val = left + client >= scroll ? left = 0 : left += width
    }

    this.scrollTo(val);
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

    width * this.items.length < client
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
