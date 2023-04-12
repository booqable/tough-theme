class Header {
  constructor(section) {
    this.section = section;

    this.minHeight = 180;
    this.mediaQuery = 1100;

    this.selector = {
      body: "body",
      bar: ".announcement-bar",
      view: ".preview-bar__container",
      header: ".header",
      headerNav: ".header__nav-wrapper",
      menu: ".menu",
      menuItem: ".menu__item",
      menuDrop: ".has-dropdown",
      menuBottom: ".header-menu-bottom",
      menuOpener: "#mobile-menu-opener",
      search: ".header__search",
      searchOpener: "#search-opener",
      account: ".header__account",
      accountOpener: "#account-opener",
      checkbox: "input[type=checkbox]"
    };

    this.classes = {
      sticky: "header--sticky"
    };

    this.modificator = {
      scroll: "scrolled-down",
      overflow: "overflow-hidden",
      active: "active"
    };

    this.props = {
      height: '--header-height',
      barHeight: '--announcement-height',
      viewHeight: '--preview-height',
      linkHeight: '--menu-position',
      transform: '--header-transform'
    };
  }

  init() {
    if (!this.section) {
      return false;
    }

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
    this.body = document.querySelector(this.selector.body);
    this.view = document.querySelector(this.selector.view);
    this.bar = this.section.querySelector(this.selector.bar);
    this.menu = this.section.querySelector(this.selector.menu);
    this.bottom = this.section.querySelector(this.selector.menuBottom);
    this.item = this.section.querySelector(this.selector.menuItem);
    this.items = [...this.section.querySelectorAll(this.selector.menuDrop)];
    this.menuOpener = this.section.querySelector(this.selector.menuOpener);
    this.searchOpener = this.section.querySelector(this.selector.searchOpener);
    this.accountOpener = this.section.querySelector(this.selector.accountOpener);
    this.dropOpeners = [...this.menu.querySelectorAll(this.selector.checkbox)];
    this.sticky = this.section.classList.contains(this.classes.sticky);
    this.last = 0;
  }

  events() {
    this.headerFixed();
    this.headerHeight();
    this.menuPosition();
    this.hoverClose();

    document.addEventListener("click", this.menuOverflow.bind(this));
    document.addEventListener("click", this.closeModals.bind(this));
    window.addEventListener("scroll", this.scrollProps.bind(this));
    window.addEventListener("resize", this.headerHeight.bind(this));
    window.addEventListener("resize", this.menuPosition.bind(this));
    window.addEventListener("resize", this.closeMenuResize.bind(this));
  }

  headerFixed() {
    if (!this.sticky) return false;

    this.section.style.position = "fixed"
  }

  cssVar(key, val) {
    this.doc.style.setProperty(
      `${key}`,
      `${val}px`
    );
  }

  // getting height of header and set css variables
  headerHeight() {
    let height = this.section.getBoundingClientRect().height,
        barHeight = 0,
        viewHeight = 0;

    if (this.bar) {
      barHeight = this.bar.getBoundingClientRect().height;
      this.cssVar(this.props.barHeight, Math.floor(barHeight));
    }

    if (this.view) {
      viewHeight = this.view.getBoundingClientRect().height;

      if (this.sticky) height += viewHeight;

      this.cssVar(this.props.viewHeight, Math.floor(viewHeight));
    }

    this.cssVar(this.props.height, Math.floor(height));
  }

  // setting properties when scroll page
  scrollProps() {
    if (!this.bar) return false;

    let isScroll = this.body.classList.contains(this.modificator.scroll),
        current = window.scrollY,
        height = this.bar.getBoundingClientRect().height;

    if (current <= this.minHeight) {
      this.body.classList.remove(this.modificator.scroll);
      this.cssVar(this.props.transform, 0);

      return;
    }

    if (current > this.last && !isScroll) { // down
      this.body.classList.add(this.modificator.scroll);
      this.cssVar(this.props.transform, -height);

    } else if (current < this.last - 10 && isScroll) { // up
      this.body.classList.remove(this.modificator.scroll);
      this.cssVar(this.props.transform, 0)
    }

    this.last = current;
  }

  // add css variable when desktop menu is in bottom mode for menu positioning
  menuPosition() {
    if (!this.bottom) return false;

    let height = this.item.getBoundingClientRect().height;

    this.cssVar(this.props.linkHeight, height);
  }

  // adding overflow:hidden when menu opened while header is not sticky on mobile
  menuOverflow(e) {
    const target = e.target.previousElementSibling;

    if (target !== this.menuOpener) return false;

    this.menuOpener.checked ? this.closeMenu() : this.addOverflow()
  }

  closeMenu() {
    this.removeOverflow();
    this.closeMobileDrop();
  }

  closeMenuResize() {
    if (window.innerWidth >= this.mediaQuery) {
      this.closeMenu(),
      this.menuOpener.checked = false
    }
  }

  // closing all dropdowns when mobile menu closed
  closeMobileDrop() {
    this.dropOpeners.forEach(opener => opener.checked = false)
  }

  // closing modals of search and account, and mobile menu on click on header icons
  closeModals(e) {
    this.killModal(e, this.searchOpener, key.search);
    this.killModal(e, this.accountOpener, key.account);

    let target = e.target,
        accountOpener = this.accountOpener,
        searchOpener = this.searchOpener,
        checked = this.menuOpener.checked,
        block = key.header;

    if (target === accountOpener && checked || target === searchOpener && checked) {
      block = key.headerNav;
      this.closeMobileDrop();
      this.removeOverflow();
      this.killModal(e, this.menuOpener, block);
    }
  }

  // closing modal window on click outside it
  killModal(e, elem, parent) {
    if (!elem) return false;

    let target = e.target,
        parentElem = target.closest(parent);

    if (parentElem !== null) return false;

    elem.checked = false;
  }

  // closing modal windows of header on hover and add class on menu items on desktop
  hoverClose() {
    if (!this.items.length) return false;

    const event = e => {
      const target = e.target,
            type = e.type,
            time = 500;

      switch (type) {
        case "mouseenter":
          this.closeModals(e);
          target.classList.add(this.modificator.active);

          break;

        case "mouseleave":
          setTimeout(() => {
            target.classList.remove(this.modificator.active);
          }, time);

          break;
      }
    }

    this.items.forEach((item) => {
      item.addEventListener('mouseenter', event);
      item.addEventListener('mouseleave', event);
    });
  }

  addOverflow() {
    if (this.sticky) return false;

    this.doc.classList.add(this.modificator.overflow);
  }

  removeOverflow() {
    if (this.sticky) return false;

    this.doc.classList.remove(this.modificator.overflow);
  }
}

const stickyHeader = new Header(document.querySelector('.header'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") stickyHeader.init();
});
