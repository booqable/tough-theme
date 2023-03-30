const selector = {
  body: "body",
  previewBar: ".preview-bar__container",
  announcementBar: ".announcement-bar",
  menuBottom: ".header-menu-bottom",
  menu: ".menu",
  menuItem: ".menu__item",
  menuLink: ".menu__link",
  input: "input[type=checkbox]",
  menuTrigger: "#mobile-menu-trigger",
  searchTrigger: "#floating-search",
  accountTrigger: "#account-opener"
};

const classes = {
  headerSticky: "header--sticky",
  menuItem: "menu__item",
  menuLink: "menu__link",
  menuOpener: "menu__dropdown-opener"
};

const modifiers = {
  scrolled: "scroll-down",
  overflow: "overflow-hidden"
};

const props = {
  height: '--header-height',
  barHeight: '--announcement-bar-height',
  linkHeight: '--menu-link-height',
  previewHeight: '--preview-bar-height',
  transform: '--header-transform'
}

const minHeight = 180;
const mobilePoint = 1100;

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
    this.html = document.documentElement;
    this.body = document.querySelector(selector.body);
    this.previewBar = document.querySelector(selector.previewBar);
    this.announcementBar = this.container.querySelector(selector.announcementBar);
    this.isSticky = this.container.classList.contains(classes.headerSticky);
    this.isMenuBottom = this.container.querySelector(selector.menuBottom);
    this.menu = this.container.querySelector(selector.menu);
    this.menuTrigger = this.container.querySelector(selector.menuTrigger);
    this.menuItem = this.container.querySelector(selector.menuItem);
    this.menuItems = [...this.container.querySelectorAll(selector.menuItem)];
    this.openers = [...this.menu.querySelectorAll(selector.input)];
    this.searchTrigger = this.container.querySelector(selector.searchTrigger);
    this.accountTrigger = this.container.querySelector(selector.accountTrigger);
    this.lastScroll = 0;
  }

  initEvents() {
    this.getHeaderHeight();
    this.setMenuBottomPosition();

    document.addEventListener("click", this.headerIconsClick.bind(this));
    document.addEventListener("mouseover", this.closeHeaderModals.bind(this));
    window.addEventListener("scroll", this.setPropsOnScroll.bind(this));
    window.addEventListener("resize", this.getHeaderHeight.bind(this));
    window.addEventListener("resize", this.setMenuBottomPosition.bind(this));
    window.addEventListener("resize", this.closeMobileMenuResize.bind(this));
  }

  // getting height of header and set css variables
  getHeaderHeight() {
    let headerHeight = this.container.getBoundingClientRect().height,
        announcementBarHeight = 0,
        previewBarHeight = 0;

    if (this.announcementBar) {
      announcementBarHeight = this.announcementBar.getBoundingClientRect().height;

      this.html.style.setProperty(
        `${props.barHeight}`,
        `${announcementBarHeight}px`
      );
    }

    if (this.previewBar) {
      previewBarHeight = this.previewBar.getBoundingClientRect().height;
      headerHeight += previewBarHeight;

      this.html.style.setProperty(
        `${props.previewHeight}`,
        `${previewBarHeight}px`
      );
    }

    this.html.style.setProperty(
      `${props.height}`,
      `${Math.floor(headerHeight) - 1}px`
    );
  }

  // setting properties when scroll page
  setPropsOnScroll() {
    if (!this.announcementBar) return false;

    this.isScrolled = this.body.classList.contains(modifiers.scrolled);
    this.currentScroll = window.scrollY;

    if (this.currentScroll <= minHeight) {
      this.body.classList.remove(modifiers.scrolled);
      this.html.style.setProperty(
        `${props.transform}`,
        '0'
      );
      return;
    }

    this.currentScroll > this.lastScroll && !this.isScrolled
      ? // down
        (this.body.classList.add(modifiers.scrolled),
        this.html.style.setProperty(
          `${props.transform}`,
          `-${this.announcementBar.offsetHeight}px`
        ))
      : this.currentScroll < this.lastScroll - 10 && this.isScrolled
        ? // up
          (this.body.classList.remove(modifiers.scrolled),
          this.html.style.setProperty(
            `${props.transform}`,
            '0'
          ))
      : null

    this.lastScroll = this.currentScroll;

  }

  // add css variable when desktop menu is in bottom mode for menu positioning
  setMenuBottomPosition() {
    if (!this.isMenuBottom) return false;

    let itemHeight = this.menuItem.getBoundingClientRect().height;

    this.html.style.setProperty(
      `${props.linkHeight}`,
      `${itemHeight}px`
    );
  }

  // adding overflow:hidden when menu opened while header is not sticky on mobile
  // closing modals of search and account, and mobile menu on click on header icons
  // closing all dropdowns when menu closed on mobile
  headerIconsClick(e) {
    let target = e.target,
        targetTrigger = target.previousElementSibling;

    switch (targetTrigger) {
      case this.menuTrigger:
        this.accountTrigger.checked = false;
        this.searchTrigger.checked = false;

        this.menuTrigger.checked
          ? this.closeMobileMenu()
          : this.addOverflow()

        break;

      case this.searchTrigger:
        this.menuTrigger.checked = false;
        this.accountTrigger.checked = false;
        this.closeMobileDropMenu();
        this.removeOverflow();

        break;

      case this.accountTrigger:
        this.menuTrigger.checked = false;
        this.searchTrigger.checked = false;
        this.closeMobileDropMenu();
        this.removeOverflow();

        break;
    }
  }

  closeMobileMenu() {
      this.removeOverflow();
      this.closeMobileDropMenu();
  }

  closeMobileMenuResize() {
    window.innerWidth >= mobilePoint
      ? (this.closeMobileMenu(),
        this.menuTrigger.checked = false)
      : null
  }

  closeMobileDropMenu() {
    this.openers.forEach(opener => opener.checked = false)
  }

  closeHeaderModals(e) {
    if (!this.menuItems.length) return false;

    let target = e.target,
        targetTrigger,
        items;

    switch (target.classList[0]) {
      case classes.menuItem:
        if (!target.firstElementChild.classList.contains(classes.menuLink)) {
          items = [...this.container.querySelectorAll(selector.menuItem)];
          targetTrigger = target.firstElementChild;
        }

        break;

      case classes.menuLink:
        if (target.parentElement.firstElementChild.classList.contains(classes.menuLink)) {
          return false;
        }

        break;

      case classes.menuOpener:
        items = [...this.container.querySelectorAll(selector.menuLink)];
        targetTrigger = target.parentElement.firstElementChild;

        break;
    }

    if (!items.length) return false;

    items.forEach(item => {
      if (target === item) {
        if (targetTrigger) {
          this.accountTrigger.checked = false;
          this.searchTrigger.checked = false;
        }
      }
    })
  }

  addOverflow() {
    !this.isSticky ? this.html.classList.add(modifiers.overflow) : null
  }

  removeOverflow() {
    !this.isSticky ? this.html.classList.remove(modifiers.overflow) : null
  }
}

const stickyHeader = new Header(document.querySelector('.header'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") stickyHeader.init();
});

