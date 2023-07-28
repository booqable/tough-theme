class Header {
  constructor(section) {
    this.section = section;

    this.minHeight = 180;
    this.mediaQuery = 1100;

    this.selector = {
      body: "body",
      link: "a",
      bar: ".top-bar",
      barBlock: ".top-bar__text",
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
      checkbox: "input[type=checkbox]"
    };

    this.classes = {
      sticky: "header--sticky",
      notSticky: "header--not-sticky",
      opened: "header--menu-opened"
    };

    this.modifier = {
      scroll: "scrolled-down",
      overflow: "overflow-hidden",
      active: "active"
    };

    this.props = {
      height: '--header-height',
      barHeight: '--top-bar-height',
      viewHeight: '--preview-height',
      linkHeight: '--menu-position',
      transform: '--header-transform',
      fontSize: 'font-size',
      fixed: 'fixed'
    };

    this.attr = {
      href: "href",
      class: "class",
      style: "style"
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
    this.barBlocks = this.section.querySelectorAll(this.selector.barBlock);
    this.menu = this.section.querySelector(this.selector.menu);
    this.bottom = this.section.querySelector(this.selector.menuBottom);
    this.item = this.section.querySelector(this.selector.menuItem);
    this.items = this.section.querySelectorAll(this.selector.menuDrop);
    this.menuOpener = this.section.querySelector(this.selector.menuOpener);
    this.searchOpener = this.section.querySelector(this.selector.searchOpener);
    this.dropOpeners = this.menu.querySelectorAll(this.selector.checkbox);
    this.sticky = this.section.classList.contains(this.classes.sticky);
    this.notSticky = this.section.classList.contains(this.classes.notSticky);
    this.last = 0;
  }

  events() {
    this.headerFixed();
    this.headerHeight();
    this.menuPosition();
    this.hoverClose();
    this.produceEmailPhone();

    document.addEventListener("click", this.menuOverflow.bind(this));
    document.addEventListener("click", this.closeModals.bind(this));
    window.addEventListener("scroll", this.scrollProps.bind(this));
    window.addEventListener("resize", this.headerHeight.bind(this));
    window.addEventListener("resize", this.menuPosition.bind(this));
    window.addEventListener("resize", this.closeMenuResize.bind(this));
  }

  headerFixed() {
    if (!this.sticky) return false;

    this.section.style.position = this.props.fixed;
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

    let isScroll = this.body.classList.contains(this.modifier.scroll),
        current = window.scrollY,
        height = this.bar.getBoundingClientRect().height;

    if (current <= this.minHeight) {
      this.body.classList.remove(this.modifier.scroll);
      this.cssVar(this.props.transform, 0);

      return;
    }

    if (current > this.last && !isScroll) { // down
      this.body.classList.add(this.modifier.scroll);
      this.cssVar(this.props.transform, -height);

    } else if (current < this.last - 10 && isScroll) { // up
      this.body.classList.remove(this.modifier.scroll);
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

  // closing modals of search and mobile menu on click on header icons
  closeModals(e) {
    this.killModal(e, this.searchOpener, this.selector.search);

    let target = e.target,
        searchOpener = this.searchOpener,
        checked = this.menuOpener.checked,
        block = this.selector.header;

    if (target === searchOpener && checked) {
      block = this.selector.headerNav;
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
          target.classList.add(this.modifier.active);

          break;

        case "mouseleave":
          setTimeout(() => {
            target.classList.remove(this.modifier.active);
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
    this.doc.classList.add(this.modifier.overflow);

    if (!this.notSticky) return false;

    this.section.classList.add(this.classes.opened);
    this.section.style.position = this.props.fixed;
  }

  removeOverflow() {
    this.doc.removeAttribute(this.attr.class);

    if (!this.notSticky) return false;

    this.section.classList.remove(this.classes.opened);
    window.scrollTo(0, 0);
    this.section.removeAttribute(this.attr.style);
  }

  // produce links to allow users to send emails and call phone numbers
  produceEmailPhone() {
    if (!this.barBlocks.length) return false;

    const keepOnly = /[^a-zA-Z0-9,\-.?!@+]/g,
          specChars = /[\()\-\s]/g,
          phoneRegex = /(?:[-+() ]*\d){10,13}/gm,
          emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

    this.barBlocks.forEach(block => {
      const links = block.querySelectorAll(this.selector.link);

      if (!links.length) return false;

      links.forEach(link => {
        let href = link.getAttribute(this.attr.href);
        const match = href.match(phoneRegex) || href.match(emailRegex);

        if (match?.length) {
          href = match[0].replace(keepOnly, '')

          if (href.match(phoneRegex)) href = `tel:${href.replaceAll(specChars, '')}`;
          if (href.match(emailRegex)) href = `mailto:${href}`;

          link.setAttribute(this.attr.href, href);
        }
      });
    })
  }
}

const stickyHeader = new Header(document.querySelector('.header'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") stickyHeader.init();
});
