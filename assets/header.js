const keys = {
  body: "body",
  previewBar: ".preview-bar__container",
  announcementBar: ".announcement-bar",
  header: ".header",
  headerNav: ".header__nav-wrapper",
  menu: ".menu",
  menuItem: ".menu__item",
  menuDrop: ".has-dropdown",
  menuBottom: ".header-menu-bottom",
  menuBtn: "#mobile-menu-opener",
  search: ".header__search",
  searchBtn: "#search-opener",
  acc: ".header__account",
  accBtn: "#account-opener",
  input: "input[type=checkbox]"
};

const cls = {
  sticky: "header--sticky"
};

const mods = {
  scroll: "scrolled-down",
  overflow: "overflow-hidden",
  active: "active"
};

const prop = {
  height: '--header-height',
  barHeight: '--announcement-bar-height',
  lnkHeight: '--menu-link-height',
  prwHeight: '--preview-bar-height',
  transform: '--header-transform'
}

const minHeight = 180;
const mediaQuery = 1100;

class Header {
  constructor(container) {
    this.c = container;
  }

  init() {
    if (!this.c) {
      return false;
    }

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
    this.body = document.querySelector(keys.body);
    this.prwBar = document.querySelector(keys.previewBar);
    this.ancBar = this.c.querySelector(keys.announcementBar);
    this.menu = this.c.querySelector(keys.menu);
    this.bottom = this.c.querySelector(keys.menuBottom);
    this.item = this.c.querySelector(keys.menuItem);
    this.items = [...this.c.querySelectorAll(keys.menuDrop)];
    this.menuBtn = this.c.querySelector(keys.menuBtn);
    this.srchBtn = this.c.querySelector(keys.searchBtn);
    this.accBtn = this.c.querySelector(keys.accBtn);
    this.btnArr = [...this.menu.querySelectorAll(keys.input)];
    this.sticky = this.c.classList.contains(cls.sticky);
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

    this.c.style.position = "fixed"
  }

  cssVar(key, val) {
    this.doc.style.setProperty(
      `${key}`,
      `${val}px`
    );
  }

  // getting height of header and set css variables
  headerHeight() {
    let h = this.c.getBoundingClientRect().height,
        a = 0,
        p = 0;

    if (this.ancBar) {
      a = this.ancBar.getBoundingClientRect().height;
      this.cssVar(prop.barHeight, Math.floor(a));
    }

    if (this.prwBar) {
      p = this.prwBar.getBoundingClientRect().height;

      if (this.sticky) h += p;

      this.cssVar(prop.prwHeight, Math.floor(p));
    }

    this.cssVar(prop.height, Math.floor(h));
  }

  // setting properties when scroll page
  scrollProps() {
    if (!this.ancBar) return false;

    let inScroll = this.body.classList.contains(mods.scroll),
          curr = window.scrollY,
          h = this.ancBar.getBoundingClientRect().height;

    if (curr <= minHeight) {
      this.body.classList.remove(mods.scroll);
      this.cssVar(prop.transform, 0);

      return;
    }

    if (curr > this.last && !inScroll) { // down
      this.body.classList.add(mods.scroll);
      this.cssVar(prop.transform, -h);
    } else if (curr < this.last - 10 && inScroll) { // up
      this.body.classList.remove(mods.scroll);
      this.cssVar(prop.transform, 0)
    }

    this.last = curr;
  }

  // add css variable when desktop menu is in bottom mode for menu positioning
  menuPosition() {
    if (!this.bottom) return false;

    let h = this.item.getBoundingClientRect().height;

    this.cssVar(prop.lnkHeight, h);
  }

  // adding overflow:hidden when menu opened while header is not sticky on mobile
  menuOverflow(e) {
    const t = e.target.previousElementSibling;

    if (t !== this.menuBtn) return false;

    this.menuBtn.checked ? this.closeMenu() : this.addOverflow()
  }

  closeMenu() {
    this.removeOverflow();
    this.closeMobileDrop();
  }

  closeMenuResize() {
    if (window.innerWidth >= mediaQuery) {
      this.closeMenu(),
      this.menuBtn.checked = false
    }
  }

  // closing all dropdowns when mobile menu closed
  closeMobileDrop() {
    this.btnArr.forEach(btn => btn.checked = false)
  }

  // closing modals of search and account, and mobile menu on click on header icons
  closeModals(e) {
    this.killModal(e, this.srchBtn, keys.search);
    this.killModal(e, this.accBtn, keys.acc);

    let t = e.target,
        acc = this.accBtn,
        srh = this.srchBtn,
        chk = this.menuBtn.checked,
        blk = keys.header;

    if (t === acc && chk || t === srh && chk) {
      blk = keys.headerNav;
      this.closeMobileDrop();
      this.removeOverflow();
      this.killModal(e, this.menuBtn, blk);
    }
  }

  // closing modal window on click outside it
  killModal(e, el, sel) {
    if (!el) return false;

    let t = e.target,
        p = t.closest(sel);

    if (p !== null) return false;

    el.checked = false;
  }

  // closing modal windows of header on hover and add class on menu items on desktop
  hoverClose() {
    if (!this.items.length) return false;

    const event = e => {
      const t = e.target,
            type = e.type,
            time = 500;

      switch (type) {
        case "mouseenter":
          this.closeModals(e);
          t.classList.add(mods.active);

          break;

        case "mouseleave":
          setTimeout(() => {
            t.classList.remove(mods.active);
          }, time);

          break;
      }
    }

    this.items.forEach((trigger) => {
      trigger.addEventListener('mouseenter', event);
      trigger.addEventListener('mouseleave', event);
    });
  }

  addOverflow() {
    if (this.sticky) return false;

    this.doc.classList.add(mods.overflow);
  }

  removeOverflow() {
    if (this.sticky) return false;

    this.doc.classList.remove(mods.overflow);
  }
}

const stickyHeader = new Header(document.querySelector('.header'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") stickyHeader.init();
});

