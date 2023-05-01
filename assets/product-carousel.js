class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      pagItem: ".carousel__bullet",
      box: ".products__carousel-wrapper",
      item: ".products__carousel-item"
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
  }

  elements() {
    this.box = this.block.querySelector(this.selector.box);
    this.item = this.block.querySelector(this.selector.item);
    this.arr = [...this.block.querySelectorAll(this.selector.pagItem)];
  }

  events() {
    document.addEventListener("click", this.navigation.bind(this));
    document.addEventListener("click", this.pagination.bind(this));
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
        val = left === 0 ? scroll : left - width;

        left === 0 ? i = this.arr.length : i = Math.ceil(left / width)

        this.pagination(e, i)

        break;
      case list.contains(this.classes.next):
        val = left >= scroll - client ? left = 0 : left + width;

        if(left + width >= scroll - client) {
          i = this.arr.length
        } else {
          console.log(left);
          console.log(width);
          console.log(Math.floor(left / width + 1));
          // if (left < width) {
          //   i = 1
          // } else {
            i = Math.floor(left / width + 1)
          // }
          // console.log(i);
        }

        this.pagination(e, i)

        break;
      case list.contains(this.classes.pag):
        val = width * (index - 1);

        break;
    }

    this.scrollTo(val);
  }

  pagination(e, i) {
    const target = e.target,
          isEl = target.classList.contains(this.classes.pag);

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

function initCarousel(selector = ".products__carousel") {
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
