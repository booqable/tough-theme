class Tabs {
  constructor(block) {
    this.block = block;

    this.selector = {
      tab: ".tabs__trigger",
      content: ".tabs__content",
      select: ".tabs__select",
      opener: "#tabs-select-opener"
    }

    this.classes = {
      tab: "tabs__trigger"
    }

    this.modifiers = {
      active: "active"
    };

    this.data = {
      content: "data-content",
      trigger: "data-trigger"
    };
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.tabs = [...this.block.querySelectorAll(this.selector.tab)];
    this.content = [...this.block.querySelectorAll(this.selector.content)];
    this.opener = this.block.querySelector(this.selector.opener);
  }

  events() {
    document.addEventListener("click", this.closeModals.bind(this));
    document.addEventListener("click", this.tabsTrigger.bind(this));
  }

  tabsTrigger(e) {
    let target = e.target,
        isEl = target.classList.contains(this.classes.tab),
        isParent = target.parentElement.classList.contains(this.classes.tab);

    if (!isEl && !isParent) return false;

    if (isParent) target = target.parentElement;

    const attr = target.getAttribute(this.data.trigger);

    let options = {
      arr: this.tabs,
      attr: this.data.trigger,
      val: attr,
      mod: this.modifiers.active
    }

    this.tabsClass(options);

    if (!this.content.length) return false;

    options = {
      arr: this.content,
      attr: this.data.content,
      val: attr,
      mod: this.modifiers.active
    }

    this.tabsClass(options);
  }

  tabsClass(options) {
    const {arr, attr, val, mod} = options;

    arr?.forEach(el => {
      const id = el?.getAttribute(attr);

      el?.classList.remove(mod);

      if (val === id) el?.classList.add(mod);
    })
  }

  closeModals(e) {
    this.killModal(e, this.opener, this.selector.select);
  }

  // closing modal window on click outside it
  killModal(e, elem, parent) {
    if (!elem) return false;

    let target = e.target,
        parentElem = target.closest(parent);

    if (parentElem !== null) return false;

    elem.checked = false;
  }
}

const initTabs = (el = ".tabs") => {
  const nodes = [...document.querySelectorAll(el)];

  if (!nodes.length) return false;

  nodes.forEach(node => {
    const tabs = new Tabs(node);
    tabs.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initTabs()
});
