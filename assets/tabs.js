class Tabs {
  constructor(block) {
    this.block = block;

    this.selector = {
      opener: ".tabs__trigger",
      content: ".tabs__content"
    }

    this.classes = {
      opener: "tabs__trigger"
    }

    this.modifiers = {
      active: "active"
    };

    this.data = {
      id: "id",
      href: "href"
    };
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.tabs = [...this.block.querySelectorAll(this.selector.opener)];
    this.content = [...this.block.querySelectorAll(this.selector.content)];
  }

  events() {
    document.addEventListener("click", this.tabsTrigger.bind(this));
  }

  tabsTrigger(e) {
    e.preventDefault();

    const target = e.target,
          isEl = target.classList.contains(this.classes.opener);

		if (!isEl) return null;

    this.tabs.forEach(el => {
      el.classList.remove(this.modifiers.active)
    })

    const attr = target.getAttribute(this.data.href).substring(1);
    target.classList.add(this.modifiers.active);

    this.tabsContent(attr);
  }

  tabsContent(attr) {
    if (!this.content.length) return false;

    this.content.forEach(el => {
      const id = el.getAttribute(this.data.id);

      el.classList.remove(this.modifiers.active);

      if (attr === id) {
        el.classList.add(this.modifiers.active);
      }
    })
  }
}

const initHero = (el = ".tabs") => {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(item => {
    const tabs = new Tabs(item);
    tabs.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initHero()
});
