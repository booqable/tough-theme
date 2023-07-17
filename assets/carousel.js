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
      full: "carousel__fluid",
      fade: "carousel__fade-effect",
      pause: "carousel__pause",
      dot: "carousel__dot",
      thumb: "carousel__thumb",
      thumbNav: "carousel__navigation-thumbs",
      prev: "prev",
      next: "next",
      init: "initialized"
    }

    this.modifiers = {
      active: "active",
      indent: "indent",
      hidden: "hidden",
      show: "show",
      hide: "hide"
    }

    this.data = {
      index: "data-index",
      prev: "prev",
      next: "next"
    };

    this.tablet = 992;
    this.timer = 500;
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
    this.interval;
    this.index;
    this.start = 0;
    this.end = 0;
    this.touchstart = 0;
    this.touchend = 0;
    this.scrollTimer = null;
    this.scrollArr = [];
  }

  events(e) {
    this.carouselInit();
    this.startTimer(e);
    this.pauseAutoRotate();
    this.hideControls();
    this.hidePaginationDots();

    this.listener(this.dots, 'click', this.pagination);
    this.listener(this.dots, 'click', this.navigation);
    this.listener(this.btns, 'click', this.navigation);
    document.addEventListener('wheel', this.touchpadSwipePoints.bind(this));
    document.addEventListener('touchstart', this.screenSwipePoints.bind(this));
    document.addEventListener('touchend', this.screenSwipePoints.bind(this));
    window.addEventListener('resize', this.hidePaginationDots.bind(this));
    window.addEventListener('resize', this.hideControls.bind(this));
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
    if (!time) return false;

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

  // hide not used dots of the pagination
  hidePaginationDots() {
    if (!this.dots) return false;

    if (this.dots[0].classList.contains(this.classes.thumb)) return false;

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

    if (!isPrev && !isNext && !isDot && !time && time === 0) return false;

    const isFade = this.block.classList.contains(this.classes.fade),
          fullWidth = this.block.classList.contains(this.classes.full),
          isThumb = target?.classList.contains(this.classes.thumb),
          isThumbs = target?.parentElement.classList.contains(this.classes.thumbNav),
          index = parseInt(target?.getAttribute(this.data.index)),
          prev = this.data.prev,
          next = this.data.next;

    let parent, element, left, top, scrollX, scrollY, clientX, clientY, children;

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
        if (scrollY > scrollX) {
          const options = {
            unit: top,
            clientVal: clientY,
            scrollVal: scrollY,
            scrollToVal: valueTop,
            size: height,
            button: prev,
            thumbsNav: isThumbs
          }

          valueTop = this.slideEfect(e, options);

        } else {
          const options = {
            unit: left,
            clientVal: clientX,
            scrollVal: scrollX,
            scrollToVal: valueLeft,
            size: width,
            button: prev,
            thumbsNav: isThumbs,
            fullWidth: fullWidth
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
            button: next,
            thumbsNav: isThumbs
          }

          valueTop = this.slideEfect(e, options);

        } else {
          const options = {
            unit: left,
            clientVal: clientX,
            scrollVal: scrollX,
            scrollToVal: valueLeft,
            size: width,
            button: next,
            thumbsNav: isThumbs
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
    const {unit, scrollVal, clientVal, size, button, thumbsNav, fullWidth} = options;
    let i, condition, lastIndex, nextIndex, scrollToLast, scrollToNext, scrollToVal;

    switch (button) {
      case this.data.prev:
        condition = unit === 0;
        lastIndex = Math.ceil((scrollVal - clientVal) / size + 1);
        nextIndex = Math.ceil(unit / size);
        scrollToLast = scrollVal;
        scrollToNext = unit - size;

        break;

      case this.data.next:
        condition = unit >= scrollVal - clientVal - 16;
        lastIndex = 1;
        nextIndex = parseInt(unit / size + 2);
        scrollToLast = 0;
        scrollToNext = unit + size;

        break;
    }

    if (condition) {
      i = lastIndex;
      if (fullWidth && clientVal < this.tablet) i -= 1;
      scrollToVal = scrollToLast;
    } else {
      i = nextIndex;
      scrollToVal = scrollToNext;
    }

    if (!thumbsNav) {
      this.pagination(e, i);
    }

    return scrollToVal
  }

  // search new index for active slide on Fade carousel mode
  fadeEffect(e, options) {
    const {arr, equal, last, nextNumber, nextIndex} = options;
    let i;

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
    const {el, left, top} = options;

    el.scrollTo({
      left: left,
      top: top,
      behavior: "smooth",
    });
  }

  hideControls() {
    if (!this.navi && !this.pagi) return false;

    const clientX = this.wrap.clientWidth,
          scrollX = this.wrap.scrollWidth,
          clientY = this.wrap.clientHeight,
          scrollY = this.wrap.scrollHeight;

    if (clientX === scrollX && clientY === scrollY) {
      this.navi?.classList.add(this.modifiers.hidden);
      this.pagi?.classList.add(this.modifiers.hidden);
      if (this.navi?.classList.contains(this.classes.thumbNav)) {
        this.navi?.parentElement.classList.remove(this.modifiers.indent);
      }
    } else {
      this.navi?.classList.remove(this.modifiers.hidden);
      this.pagi?.classList.remove(this.modifiers.hidden);
      if (this.navi?.classList.contains(this.classes.thumbNav)) {
        this.navi?.parentElement.classList.add(this.modifiers.indent);
      }
    }
  }

  // touchpoints detection on touch screens
  screenSwipePoints(e) {
    const target = e?.target.closest(this.selector.wrapper),
          dots = this.getCurrentDot().dots,
          left = this.wrap.scrollLeft;

    if (!dots.length && !target) return false;

    if (e.type === "touchstart") {
      this.touchstart = e.changedTouches[0].screenX;
      this.start = left
    }

    if (e.type === "touchend") {
      this.touchend = e.changedTouches[0].screenX;
        setTimeout(() => {
          this.end = left

          this.paginationIndex(undefined);
        }, this.timer);
    }
  }

  // touchpad touchpoints detection
  touchpadSwipePoints(e) {
    const target = e?.target.closest(this.selector.wrapper),
          dots = this.getCurrentDot().dots,
          index = this.getCurrentDot().index,
          left = this.wrap.scrollLeft,
          isFade = this.block.classList.contains(this.classes.fade),
          isFull = target?.parentElement.classList.contains(this.classes.full);

    if (!dots.length && !target && !index) return false;

    let direction;

    const delta = e.deltaX; // Get the scroll direction (+1 for scroll right, -1 for scroll left)

    if (delta === -1) {
      if (!isFade) {
        this.scrollArr.push(left)
      } else {
        if (isFull) {
          this.scrollArr.push(delta)
          direction = "left"
        }
      }
    } else if (delta === 1) {
      if (!isFade) {
        this.scrollArr.push(left)
      } else {
        if (isFull) {
          this.scrollArr.push(delta)
          direction = "right"
        }
      }
    }

    const points = () => {
      const first = this.scrollArr[0];
      const last = this.scrollArr.pop();
      let value;

      if (!isFade && first > last || !isFade && first < last) {
        this.touchstart = last;
        this.touchend = first;
        this.start = last;
        this.end = first;

        value = undefined;
      }

      if (isFade && first === -1 || isFade && first === 1) {
        value = direction
      }

      this.paginationIndex(value);
    }

    window.clearTimeout(this.scrollTimer);

    this.scrollTimer = setTimeout(() => {
      points();

      this.scrollArr = [];
    }, 50);
  }

  // next dot index calculation for touchpad and touchscreens scrolling
  paginationIndex(val) {
    const left = this.wrap.scrollLeft,
          width = this.item.getBoundingClientRect().width,
          index = this.getCurrentDot().index,
          dots = this.getCurrentDot().dots,
          thumb = dots[0].classList.contains(this.classes.thumb),
          size = dots.length,
          isFade = this.block.classList.contains(this.classes.fade),
          newIndex = Math.ceil(left / width),
          leftRatio = this.end - this.start,
          rightRatio = this.start - this.end;

    let leftMove, rightMove;

    if (val === "right") {
      leftMove = true
    } else if (val === "left") {
      rightMove = true
    } else {
      leftMove = this.touchstart > this.touchend;
      rightMove = this.touchstart < this.touchend;
    }

    switch (true) {
      case leftMove:
        if (!isFade && leftRatio > 20) {
          this.index = newIndex + 1;

          if (thumb) this.index -= 1
        } else {
          this.index = index >= size ? index : index + 1
        }

        break;

      case rightMove:
        if (!isFade && rightRatio > 20) {
          if (left < width) {
            this.index = 1
          } else {
            this.index = newIndex

            if (thumb) this.index += 1
          }
        } else {
          this.index = index <= 1 ? index : index - 1
        }

        break;
    }

    this.pagination(undefined, this.index);
  }

  // get the active dot index
  getCurrentDot() {
    let index = 1,
        dots = [...this.dots];

    dots = dots.filter(dot => {
      return !dot.classList.contains(this.modifiers.hidden);
    })

    dots.forEach(dot => {
      if (dot.classList.contains(this.modifiers.active))
        index = parseInt(dot.getAttribute(this.data.index));
    })

    return {index, dots};
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
