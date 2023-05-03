class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      bullet: ".carousel__bullet",
      wrapper: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer",
      count: ".carousel__count"
    }

    this.classes = {
      bullet: "carousel__bullet",
      button: "carousel__button",
      prev: "prev",
      next: "next",
      init: "initialized"
    }

    this.modifiers = {
      active: "active"
    }

    this.data = {
      id: "id",
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
    this.item = this.block.querySelector(this.selector.item);
    this.items = [...this.block.querySelectorAll(this.selector.item)];
    this.bullets = [...this.block.querySelectorAll(this.selector.bullet)];
    this.count = this.block.querySelector(this.selector.count);
    this.timer = this.block.querySelector(this.selector.timer).value * 1000;
    this.interval;
  }

  events(e) {
    this.sliderInit();
    // this.autoRotate(e, this.timer);
    this.pauseRotate();

    document.addEventListener("click", this.navigation.bind(this));
    document.addEventListener("click", this.pagination.bind(this));
  }

  sliderInit() {
    if (this.items.length < 2) return false;

    this.block.classList.add(this.classes.init);
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
      // if(e.type === "mouseenter" || e.type === "touchstart") clearInterval(this.interval)
      // if(e.type === "mouseleave" || e.type === "touchend") this.autoRotate(e, this.timer)
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

    switch (true) {
      case list?.contains(this.classes.prev):
        left === 0 ? i = Math.ceil((scroll - client) / width + 1) : i = Math.ceil(left / width)
        this.pagination(e, i)

        val = left === 0 ? scroll : left - width;

        // this.counter(10)

        break;
      case list?.contains(this.classes.next):
        left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
        this.pagination(e, i)

        val = left >= scroll - client ? left = 0 : left + width;

        break;
      case list?.contains(this.classes.bullet):
        val = width * (index - 1);

        break;
      case t !== 0 && typeof t !== 'undefined':
        if (this.items.length < 2) return false;

        left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
        this.pagination(e, i)

        val = left + client >= scroll ? left = 0 : left += width

        break;
    }

    this.scrollTo(val);
  }

  // change index of counter of slides
  counter(i) {
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
}

function initCarousel(el = ".carousel") {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach((val, i) => {
    val.setAttribute('id', `carousel-${i}`);

    const carousel = new Carousel(val);
    carousel.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initCarousel()
});
