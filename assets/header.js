const selects = {
  body: "body",
  previewBar: ".preview-bar__container",
  topBar: ".anoncement-bar"
};

const modifiers = {
  scrolled: "page-scrolled"
};

const minHeight = 180;

class Header {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) {
      return false;
    }

    this.initElements();
    this.initEvents();
  }

  initElements() {
    this.body = document.querySelector(selects.body);
    this.previewBar = document.querySelector(selects.previewBar);
    this.topBar = document.querySelector(selects.topBar);
    this.lastScroll = 0;

    setTimeout(() => {
      this.getHeaderHeight();
    }, 100); // header height fix on load on iPhone
  }

  initEvents() {
    window.addEventListener("scroll", this.setPropsOnScroll.bind(this));
    window.addEventListener("resize", this.getHeaderHeight.bind(this));
  }

  // getting height of header
  getHeaderHeight() {
    let headerHeight = this.container.getBoundingClientRect().height,
      topBarHeight = 0,
      previewBarHeight = 0;

    if (this.topBar) {
      topBarHeight = this.topBar.getBoundingClientRect().height;
      headerHeight += topBarHeight;
    }

    if (this.previewBar) {
      previewBarHeight = this.previewBar.getBoundingClientRect().height;
      headerHeight += previewBarHeight;
    }

    document.documentElement.style.setProperty(
      "--header-height",
      `${Math.floor(headerHeight) - 1}px`
    );

    document.documentElement.style.setProperty(
      "--top-bar-height",
      `${topBarHeight}px`
    );
  }

  // setting properties when scroll page
  setPropsOnScroll() {
    if (!this.topBar) {
      return false;
    }

    this.currentScroll = window.scrollY;

    if (this.currentScroll <= minHeight) {
      this.body.classList.remove(modifiers.scrolled);
      document.documentElement.style.setProperty(
        '--header-transform',
        '0px'
      );
      return;
    }

    if (
      this.currentScroll > this.lastScroll &&
      !this.body.classList.contains(modifiers.scrolled)
    ) {
      // down
      this.body.classList.add(modifiers.scrolled);
      document.documentElement.style.setProperty(
        '--header-transform',
        `-${this.topBar.offsetHeight}px`
      );
    } else if (
      this.currentScroll < this.lastScroll - 10 &&
      this.body.classList.contains(modifiers.scrolled)
    ) {
      // up
      this.body.classList.remove(modifiers.scrolled);
      document.documentElement.style.setProperty(
        '--header-transform',
        '0px'
      );
    }

    this.lastScroll = this.currentScroll;

  }
}

const stickyHeader = new Header(document.querySelector('.header--sticky'));

stickyHeader.init();
