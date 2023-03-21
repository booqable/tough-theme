const selects = {
  body: "body",
  previewBar: ".preview-bar__container",
  announcementBar: ".anoncement-bar"
};

const modifiers = {
  scrolled: "scroll-down"
};

const props = {
  transform: '--header-transform',
  height: '--header-height',
  barHeight: '--announcement-bar-height'
}

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
    this.announcementBar = document.querySelector(selects.announcementBar);
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
      announcementBarHeight = 0,
      previewBarHeight = 0;

    if (this.announcementBar) {
      announcementBarHeight = this.announcementBar.getBoundingClientRect().height;
      headerHeight += announcementBarHeight;
    }

    if (this.previewBar) {
      previewBarHeight = this.previewBar.getBoundingClientRect().height;
      headerHeight += previewBarHeight;
    }

    document.documentElement.style.setProperty(
      `${props.height}`,
      `${Math.floor(headerHeight) - 1}px`
    );

    document.documentElement.style.setProperty(
      `${props.barHeight}`,
      `${announcementBarHeight}px`
    );
  }

  // setting properties when scroll page
  setPropsOnScroll() {
    if (!this.announcementBar) {
      return false;
    }

    this.currentScroll = window.scrollY;

    if (this.currentScroll <= minHeight) {
      this.body.classList.remove(modifiers.scrolled);
      document.documentElement.style.setProperty(
        `${props.transform}`,
        '0'
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
        `${props.transform}`,
        `-${this.announcementBar.offsetHeight}px`
      );
    } else if (
      this.currentScroll < this.lastScroll - 10 &&
      this.body.classList.contains(modifiers.scrolled)
    ) {
      // up
      this.body.classList.remove(modifiers.scrolled);
      document.documentElement.style.setProperty(
        `${props.transform}`,
        '0'
      );
    }

    this.lastScroll = this.currentScroll;

  }
}

const stickyHeader = new Header(document.querySelector('.header--sticky'));

stickyHeader.init();
