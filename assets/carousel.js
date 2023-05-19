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
      dot: "carousel__dot",
      thumb: "carousel__thumb",
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

    this.tablet = 992;
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
    this.timers = [...this.block.querySelectorAll(this.selector.timer)];
    this.interval;
  }

  events(e) {
    this.carouselInit();
    this.startTimer(e);
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

  startTimer(e) {
    this.timers.forEach(timer => {
      const time = timer.value * 1000;

      this.autoRotate(e, time);
    })
  }

  carouselInit() {
    if (this.items.length < 2) return false;

    this.block.classList.add(this.classes.init);
  }

  getPrevSibling(element, selector) {
    if (element) {
      let sibling = element.previousElementSibling;

      while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.previousElementSibling;
      }
    }
  };

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
    if (!time || time === 0) return false;

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
      if(e.type === "mouseleave" || e.type === "touchend") this.startTimer(e);
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
          isPrev = target?.classList.contains(this.classes.prev),
          isNext = target?.classList.contains(this.classes.next),
          isDot = target?.classList.contains(this.classes.dot);

    if (!isPrev && !isNext && !isDot && !time  && time === 0) return false;

    const isFade = this.block.classList.contains(this.classes.fade),
          isFluid = this.block.classList.contains(this.classes.fluid),
          isThumb = target?.classList.contains(this.classes.thumb),
          index = parseInt(target?.getAttribute(this.data.index));

    let parent, element, left, top, scrollX, scrollY, clientX, clientY, children, i;

    let width = this.item.getBoundingClientRect().width,
        height = this.item.getBoundingClientRect().height,
        valueLeft = 0,
        valueTop = 0;

    if (isDot || isPrev || isNext) {
      if (isThumb) {
        parent = target?.closest(this.selector.pagination);
        const item = this.getPrevSibling(parent, this.selector.wrapper).querySelector(this.selector.item);
        width = item.getBoundingClientRect().width;

      } else {
        parent = target?.parentElement
      }

      element = this.getPrevSibling(parent, this.selector.wrapper);
    } else {
      element = this.wrap;
    }

    top = element.scrollTop;
    left = element.scrollLeft;
    scrollX = element.scrollWidth;
    scrollY = element.scrollHeight;
    clientX = element.clientWidth;
    clientY = element.clientHeight;
    children = [...element.children];

    if (isPrev) {
      if (!isFade) {

        if (scrollX === clientX) {
          const options = {
            unit: top,
            clientVal: clientY,
            scrollVal: scrollY,
            scrollToVal: valueTop,
            size: height
          }

          valueTop = this.scroll(options).scrollTo;
          i = this.scroll(options).index;
          // if (top === 0) {
          //   i = Math.ceil((scrollY - clientY) / height + 1);

          //   valueTop = scrollY;
          // } else {
          //   i = Math.ceil(top / height);
          //   valueTop = top - height;
          // }
        } else {
          const options = {
            unit: left,
            clientVal: clientX,
            scrollVal: scrollX,
            scrollToVal: valueLeft,
            size: height,
            fullWidth: isFluid
          }

          valueLeft = this.scroll(options).scrollTo;
          i = this.scroll(options).index;

          // if (left === 0) {
          //   i = Math.ceil((scrollX - clientX) / width + 1);

          //   if (isFluid && clientX < this.tablet) i -= 1;

          //   valueLeft = scrollX;
          // } else {
          //   i = Math.ceil(left / width);
          //   valueLeft = left - width;
          // }
        }

        this.pagination(e, i);

      } else {
        const options = {
          arr: children,
          equal: 0,
          last: this.items.length
        }

        this.fadeEffect(e, i, options);
      }
    }

    if (isNext || time && time !== 0) {
      if (!isFade) {
        if (left >= scrollX - clientX - 16) {
          i = 1;
          valueLeft = 0;
        } else {
          i = parseInt(left / width + 2);
          valueLeft = left + width;
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

        this.fadeEffect(e, i, options);
      }
    }

    if (isDot && !isFade) valueLeft = width * (index - 1);

    if (!isFade) {
      const options = {
        element: element,
        left: valueLeft,
        top: valueTop
      }

      this.scrollTo(options);
    }
  }

  scroll(options) {
    let {unit, scrollVal, clientVal, size, fullWidth} = options;
    let i, object, scrollToVal;

    if (unit === 0) {
      i = Math.ceil((scrollVal - clientVal) / size);

      // if (fullWidth && clientVal < this.tablet) i -= 1;
      if (fullWidth && clientVal < this.tablet) i -= 1;

      scrollToVal = scrollVal;
    } else {
      i = Math.ceil(unit / size - 1);
      scrollToVal = unit - size;
    }

    console.log(i);

    return object = {
      scrollTo: scrollToVal,
      index: i
    }
  }

  // search new index for active slide on Fade carousel mode
  fadeEffect(e, i, options) {
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

  scrollTo(options) {
    const {element, left, top} = options;

    element.scrollTo({
      left: left,
      top: top,
      behavior: "smooth",
    });
  }

  controls() {
    const width = this.item.getBoundingClientRect().width,
          client = this.wrap.clientWidth;

    width * this.items.length <= client
      ? (this.navi?.classList.add(this.classes.hidden),
        this.pagi?.classList.add(this.classes.hidden))
      : (this.navi?.classList.remove(this.classes.hidden),
        this.pagi?.classList.remove(this.classes.hidden))
  }
}

const initCarousel = (el = ".carousel") => {
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
