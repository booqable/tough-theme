class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      pagItem: ".carousel__bullet",
      box: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer"
    }

    this.classes = {
      pag: "carousel__bullet",
      nav: "carousel__button",
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
    this.variables();
  }

  elements() {
    this.box = this.block.querySelector(this.selector.box);
    this.item = this.block.querySelector(this.selector.item);
    this.items = [...this.block.querySelectorAll(this.selector.item)];
    this.arr = [...this.block.querySelectorAll(this.selector.pagItem)];
  }

  variables() {
    this.timer = this.block.querySelector(this.selector.timer).value * 1000;
    this.interval;
  }

  events() {
    this.autoRotate(this.timer);
    this.pauseRotate();

    document.addEventListener("click", this.navigation.bind(this));
    document.addEventListener("click", this.pagination.bind(this));
  }

  pauseRotate() {
    if (!this.items.length) return false;

    const event = e => {
      switch (e.type) {
        case "mouseenter":
          clearInterval(this.interval)

          break;
        case "mouseleave":
          this.autoRotate(this.timer);

          break;
      }
    }

    this.box.addEventListener('mouseenter', event);
    this.box.addEventListener('mouseleave', event);
  }

  autoRotate(time) {
    if (time === 0 ) return false;

    this.interval = setInterval(() => {
      this.eventRotate()
    }, time)

    return () => {
      clearInterval(this.interval)
    }
  }

  eventRotate(e) {
    if (this.items.length < 2) return false;

    const width = this.item.getBoundingClientRect().width,
          scroll = this.box.scrollWidth,
          client = this.box.clientWidth

    let val,
        i,
        left = this.box.scrollLeft;

    if (this.arr.length) {
      left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
      this.pagination(e, i)
    }

    val = left + client >= scroll ? left = 0 : left += width
    this.scrollTo(val);
  }

  navigation(e) {
    const target = e.target,
          isEl = target.classList.contains(this.classes.pag),
          isNav = target.classList.contains(this.classes.nav);

    if (!isNav && !isEl) return false;

    const list = target.classList,
          width = this.item.getBoundingClientRect().width,
          scroll = this.box.scrollWidth,
          client = this.box.clientWidth,
          index = parseInt(target.getAttribute(this.data.index));

    let val,
        i,
        left = this.box.scrollLeft;

    switch (true) {
      case list.contains(this.classes.prev):
        left === 0 ? i = Math.ceil((scroll - client) / width + 1) : i = Math.ceil(left / width)
        this.pagination(e, i)

        val = left === 0 ? scroll : left - width;

        break;
      case list.contains(this.classes.next):
        left >= scroll - client ? i = 1 : i = parseInt(left / width + 2)
        this.pagination(e, i)

        val = left >= scroll - client ? left = 0 : left + width;

        break;
      case list.contains(this.classes.pag):
        val = width * (index - 1);

        break;
    }

    this.scrollTo(val);
  }

  pagination(e, i) {
    const target = e?.target,
          isEl = target?.classList.contains(this.classes.pag);

    if (!isEl && i === undefined) return false;

    this.arr.forEach(el => {
      const val = parseInt(el.getAttribute(this.data.index));

      el.classList.remove(this.modifiers.active);

      if (isEl) target.classList.add(this.modifiers.active);
      if (val === i) el.classList.add(this.modifiers.active);
    })
  }

  scrollTo(val) {
    this.box.scrollTo({
      left: val,
      behavior: "smooth",
    });
  }
}

function initCarousel(selector = ".carousel") {
  const sections = [...document.querySelectorAll(selector)];

  if (!sections.length) return false;

  sections.forEach(section => {
    const carousel = new Carousel(section);
    carousel.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initCarousel()
});
