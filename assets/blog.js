class Blog {
  constructor(block) {
    this.block = block;

    this.selector = {
      item: ".blog__item",
      list: ".blog__list"
    };

    this.classes = {
      large: "blog__item-lg"
    };

    this.key = {
      row: '--grid-row',
      flow: '--grid-auto-flow'
    };

    this.value = {
      rowSm: 1,
      rowMd: 2,
      rowLg: 3,
      flow: 'column dense'
    };
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.setStyles();
  }

  elements() {
    this.items = [...this.block.querySelectorAll(this.selector.item)];
    this.item = this.block.querySelector(this.selector.item);
    this.list = this.block.querySelector(this.selector.list);
  }

  cssVar(key, val) {
    this.block.style.setProperty(
      `${key}`,
      `${val}`
    );
  }

  setStyles() {
    if (!this.items.length) return false;

    const filtered = this.items.filter((item) => item.classList.contains(this.classes.large))

    if (this.items.length <= 3) {
      if (!filtered.length) this.cssVar(this.key.row, this.value.rowSm);
    } else {
      if (filtered.length <= 1) {
        this.cssVar(this.key.row, this.value.rowSm);
      } else {
        this.cssVar(this.key.row, this.value.rowLg);
        this.cssVar(this.key.flow, this.value.flow);
        if (filtered.length > 2) {
          this.cssVar(this.key.row, this.value.rowMd);
        }
      }
    }
  }
}

function initBlog(el = ".blog") {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(item => {
    const blog = new Blog(item);
    blog.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initBlog()
});
