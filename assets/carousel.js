class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      navi: ".carousel__navigation",
      pagination: ".carousel__pagination",
      btn: ".carousel__btn",
      prev: ".carousel__btn.prev",
      next: ".carousel__btn.next",
      dot: ".carousel__dot",
      wrapper: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer",
      count: ".carousel__count"
    }

    this.classes = {
      show: "show",
      fade: "carousel__fade-effect",
      pause: "carousel__pause",
      dot: "carousel__dot",
      prev: "prev",
      next: "next",
      init: "initialized"
    }

    this.modifiers = {
      active: "active",
      hidden: "hidden",
      show: "show",
      hide: "hide"
    }

    this.data = {
      index: "data-index"
    }

    this.event = {
      click: "click",
      prev: "prev",
      next: "next",
      start: "touchstart",
      end: "touchend",
      enter: "mouseenter",
      leave: "mouseleave"
    }

    this.interval;
    this.touchstart = null;
    this.touchend = null;
    this.wheelTimeout;
    this.isWheeling = false;
    this.infinite = true;
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
    this.items = this.block.querySelectorAll(this.selector.item);
    this.btns = this.block.querySelectorAll(this.selector.btn);
    this.dots = this.block.querySelectorAll(this.selector.dot);
    this.count = this.block.querySelector(this.selector.count);
    this.timers = this.block.querySelectorAll(this.selector.timer);
  }

  events() {
    this.carouselInit();
    this.startTimer();
    this.pauseAutoRotate();
    this.hideControls();
    this.hidePaginationDots();

    this.listener(this.dots, 'click', this.pagination);
    this.listener(this.dots, 'click', this.navigation);
    this.listener(this.btns, 'click', this.navigation);
    document.addEventListener('wheel', this.touchpadPoints.bind(this));
    document.addEventListener('touchstart', this.touchscreenPoints.bind(this));
    document.addEventListener('touchend', this.touchscreenPoints.bind(this));
    window.addEventListener('resize', this.hideControls.bind(this));
    window.addEventListener('resize', this.hidePaginationDots.bind(this));
  }

  carouselInit() {
    if (this.items.length < 2) return false;

    this.block.classList.add(this.classes.init);
  }

  startTimer() {
    this.timers.forEach(timer => this.autoRotate(timer.value * 1000))
  }

  // autorotate slides of carousel
  autoRotate(time) {
    if (!time) return false;

    this.interval = setInterval(() => this.navigation(undefined, time), time);

    return () => clearInterval(this.interval);
  }

  // pause autorotate slides on hover and touch devices
  pauseAutoRotate() {
    const isPause = this.block.classList.contains(this.classes.pause);

    if (!isPause) return false;
    if (!this.items.length) return false;

    const func = e => {
      if (e.type === this.event.enter || e.type === this.event.start) clearInterval(this.interval);
      if (e.type === this.event.leave || e.type === this.event.end) this.startTimer();
    }

    this.block.addEventListener(this.event.enter, func);
    this.block.addEventListener(this.event.leave, func);
    this.block.addEventListener(this.event.start, func);
    this.block.addEventListener(this.event.end, func);
  }

  // slide the carousel left/right or top/bottom and change the index of the active dot of the pagination
  navigation(e, time) {
    const target = e?.target,
          isPrev = target?.classList.contains(this.classes.prev),
          isNext = target?.classList.contains(this.classes.next),
          isDot = target?.classList.contains(this.classes.dot);

    if (!isPrev && !isNext && !isDot && !time && time === 0) return false;

    const isFade = this.block.classList.contains(this.classes.fade),
          width = this.item.getBoundingClientRect().width,
          height = this.item.getBoundingClientRect().height,
          index = parseInt(target?.getAttribute(this.data.index)),
          prev = this.event.prev,
          next = this.event.next;

    let element, left, top, scrollX, scrollY, clientX, clientY, children, valueLeft = 0, valueTop = 0;

    element = isDot || isPrev || isNext
      ? this.getPrevSibling(target?.parentElement, this.selector.wrapper)
      : this.wrap;

    top = element.scrollTop;
    left = element.scrollLeft;
    scrollX = element.scrollWidth;
    scrollY = element.scrollHeight;
    clientX = element.clientWidth;
    clientY = element.clientHeight;
    children = [...element.children];

    if (isPrev) {
      if (!isFade) {
        if (scrollY > scrollX) {
          const options = {
            unit: top,
            clientVal: clientY,
            scrollVal: scrollY,
            scrollToVal: valueTop,
            size: height,
            trigger: prev
          }

          valueTop = this.slideEfect(e, options);

        } else {
          const options = {
            unit: left,
            clientVal: clientX,
            scrollVal: scrollX,
            scrollToVal: valueLeft,
            size: width,
            trigger: prev
          }

          valueLeft = this.slideEfect(e, options);
        }

      } else {
        const options = {
          arr: children,
          equal: 0,
          last: this.items.length
        }

        this.fadeEffect(e, options);
      }
    }

    if (isNext || time && time !== 0) {
      if (!isFade) {
        if (scrollY > scrollX) {
          const options = {
            unit: top,
            clientVal: clientY,
            scrollVal: scrollY,
            scrollToVal: valueTop,
            size: height,
            trigger: next
          }

          valueTop = this.slideEfect(e, options);

        } else {
          const options = {
            unit: left,
            clientVal: clientX,
            scrollVal: scrollX,
            scrollToVal: valueLeft,
            size: width,
            trigger: next
          }

          valueLeft = this.slideEfect(e, options);
        }

      } else {
        const options = {
          arr: children,
          equal: this.items.length,
          last: 1,
          nextNumber: 1,
          nextIndex: 2
        }

        this.fadeEffect(e, options);
      }
    }

    if (isDot && !isFade) valueLeft = width * (index - 1);

    if (!isFade) {
      const options = {
        el: element,
        left: valueLeft,
        top: valueTop
      }

      this.scrollTo(options);
    }
  }

  // logic of Carousel's Prev and Next buttons (including vertical carousel)
  slideEfect(e, options) {
    const {unit, scrollVal, clientVal, size, trigger} = options;
    let i, condition, lastIndex, nextIndex, scrollToLast, scrollToNext, scrollToVal;

    switch (trigger) {
      case this.event.prev:
        condition = unit === 0;
        lastIndex = Math.ceil((scrollVal - clientVal) / size + 1);
        nextIndex = Math.ceil(unit / size);
        scrollToLast = scrollVal;
        scrollToNext = unit - size;

        break;

      case this.event.next:
        condition = unit >= scrollVal - clientVal - 16;
        lastIndex = 1;
        nextIndex = parseInt(unit / size + 2);
        scrollToLast = 0;
        scrollToNext = unit + size;

        break;
    }

    i = condition && this.infinite ? lastIndex : nextIndex;
    scrollToVal = condition && this.infinite ? scrollToLast : scrollToNext;

    this.pagination(e, i);

    return scrollToVal
  }

  // search new index for active slide on Fade carousel mode
  fadeEffect(e, options) {
    const {arr, equal, last, nextNumber, nextIndex} = options;
    let i;

    arr.forEach((el, index) => {
      if (el.classList.contains(this.classes.show)) {
        const condition = index + (nextNumber ?? 0),
              next = index + (nextIndex ?? 0);

        i = condition === equal ? last : next
      }
    })

    this.pagination(e, i);
    this.fadeClass(i);
  }

  // change slides in Fade effect mode
  fadeClass(ind) {
    const isFade = this.block.classList.contains(this.classes.fade);

    if (!isFade || !ind || ind === 0 || ind > this.items.length) return false;

    this.items.forEach((el, i) => {
      el.classList.replace(this.modifiers.show, this.modifiers.hide);
      if (i + 1 === ind) el.classList.replace(this.modifiers.hide, this.modifiers.show);
    })
  }

  // change active dot of the pagination
  pagination(e, i, el) {
    const target = e?.target,
          isDot = target?.classList.contains(this.classes.dot),
          dots = el ?? this.dots;

    if (!isDot && typeof i === 'undefined') return false;

    dots.forEach(dot => {
      const index = parseInt(dot.getAttribute(this.data.index));

      dot.classList.remove(this.modifiers.active);

      if (isDot) target.classList.add(this.modifiers.active);
      if (index === i) dot.classList.add(this.modifiers.active);
      if (typeof i === 'undefined') i = parseInt(target.getAttribute(this.data.index));
    })

    this.counter(i);
    this.fadeClass(i);
  }

  // hide not used dots of the pagination
  hidePaginationDots() {
    if (!this.dots) return false;

    const client = this.wrap.clientWidth,
          scroll = this.wrap.scrollWidth,
          width = this.item.getBoundingClientRect().width;

    if (scroll - client > 0) {
      const numberDots = Math.ceil((scroll - client) / width);

      this.dots.forEach(dot => {
        dot.classList.add(this.modifiers.hidden);

        const index = parseInt(dot.getAttribute(this.data.index));

        if (index <= numberDots + 1) dot.classList.remove(this.modifiers.hidden);
      })
    }
  }

  // hide all controls if viewport is bigger than the width of all slides
  hideControls() {
    if (!this.navi && !this.pagi) return false;

    const clientX = this.wrap.clientWidth,
          scrollX = this.wrap.scrollWidth,
          clientY = this.wrap.clientHeight,
          scrollY = this.wrap.scrollHeight;

    clientX === scrollX && clientY === scrollY
      ? (this.navi?.classList.add(this.modifiers.hidden),
         this.pagi?.classList.add(this.modifiers.hidden))
      : (this.navi?.classList.remove(this.modifiers.hidden),
         this.pagi?.classList.remove(this.modifiers.hidden))
  }

  // change index of counter of slides
  counter(i) {
    if (!this.count) return false;

    if (i === 0 || typeof i === 'undefined') return false;

    let num = "";

    if (i < 10) num = 0;

    this.count.innerHTML = `${num}${i}`;
  }

  // touchpoints detection on touch screens
  touchscreenPoints(e) {
    const wrap = e?.target.closest(this.selector.wrapper),
          dots = this.getCurrentDot().dots;

    if (!dots.length && !wrap) return false;

    if (e.type === this.event.start) this.touchstart = e.changedTouches[0].screenX;

    if (e.type === this.event.end) {
      this.touchend = e.changedTouches[0].screenX;
      this.touchscreenDirection(wrap);
    }
  }

  touchscreenDirection(el) {
    const left = el?.scrollLeft,
          scroll = el?.scrollWidth,
          client = el?.clientWidth,
          next = el?.parentElement.querySelector(this.selector.next),
          prev = el?.parentElement.querySelector(this.selector.prev),
          isFade = el?.parentElement.classList.contains(this.classes.fade),
          leftSwipe = this.touchstart > this.touchend,
          rightSwipe = this.touchend > this.touchstart,
          dots = this.getCurrentDot().dots,
          index = this.getCurrentDot().index;

    if (!isFade) {
      if (left >= 0 && left <= scroll - client) {
        this.infinite = false;

        if (leftSwipe) this.trigger(next, this.event.click)
        if (rightSwipe) this.trigger(prev, this.event.click)

        this.infinite = true;
      }
    } else {
      if (leftSwipe && index < dots.length) this.pagination(undefined, index + 1);
      if (rightSwipe && index > 1) this.pagination(undefined, index - 1);
    }
  }

  // touchpad touchpoints detection
  touchpadPoints(e) {
    const wrap = e?.target.closest(this.selector.wrapper),
          dots = this.getCurrentDot().dots;

    if (!dots.length && !wrap) return false;

    let index = this.getCurrentDot().index;
    const delta = e.deltaX; // Get the scroll direction (+1 for scroll right, -1 for scroll left)

    if (!this.isWheeling) {
      this.isWheeling = true;

      if (delta === -1 && index > 1) index = index - 1
      if (delta === 1 && index < dots.length) index = index + 1

      this.pagination(undefined, index)
    }

    clearTimeout(this.wheelTimeout);

    this.wheelTimeout = setTimeout(() => this.isWheeling = false, 100);
  }

  // get the active dot index
  getCurrentDot() {
    let index = 1,
        dots = [...this.dots];

    dots = dots.filter(dot => !dot.classList.contains(this.modifiers.hidden))

    dots.forEach(dot => {
      if (dot.classList.contains(this.modifiers.active))
        index = parseInt(dot.getAttribute(this.data.index));
    })

    return {index, dots};
  }

  scrollTo(options) {
    const {el, left, top} = options;

    el.scrollTo({
      left: left,
      top: top,
      behavior: "smooth",
    });
  }

  trigger(el, eventType) {
    if (!el) return false;

    if (typeof eventType === 'string' && typeof el[eventType] === 'function') {
      el[eventType]();
    } else {
      const event =
        typeof eventType === 'string'
          ? new Event(eventType, {bubbles: true})
          : eventType;
      el.dispatchEvent(event);
    }
  }

  getPrevSibling(element, selector) {
    if (element) {
      let sibling = element.previousElementSibling;

      while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.previousElementSibling;
      }
    }
  }

  listener(arr, event, func) {
    arr.forEach(el => {
      el.addEventListener(`${event}`, func.bind(this));
    })
  }
}

const initCarousel = (el = ".carousel") => {
  const nodes = document.querySelectorAll(el);

  if (!nodes.length) return false;

  nodes.forEach(node => {
    const carousel = new Carousel(node);
    carousel.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initCarousel();
});
