class Sorting {
  constructor(block) {
    this.block = block;

    this.selector = {
      product: ".product-card",
      sorting: ".sorting",
      opener: "#sorting-opener"
    }

    this.classes = {
      forward: "forward",
      backward: "backward"
    }
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.opener = this.block.querySelector(this.selector.opener);
    this.arr = [...this.block.querySelectorAll(this.selector.product)];
  }

  events() {
    document.addEventListener("click", this.closeOutside.bind(this));
    document.addEventListener("click", this.sortElements.bind(this));
  }

  sortElements(e) {
    const target = e.target,
          isA = target.classList.contains(this.classes.forward),
          isZ = target.classList.contains(this.classes.backward);

    if (!isA && !isZ) return false;

    this.arr.sort((a, b) => a.innerText.localeCompare(b.innerText));

    if (isZ) this.arr.reverse((a, b) => a.innerText.localeCompare(b.innerText));

    const parent = this.arr[0].parentNode;

    this.arr.forEach(el => {
      parent.appendChild(el);
    });
  }

  closeOutside(e) {
    this.killModal(e, this.opener, this.selector.sorting);
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

const initSorting = (el = ".collection-page") => {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(item => {
    const sort = new Sorting(item);
    sort.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initSorting()
});
