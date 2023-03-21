const selector = {
  menuTrigger: "#mobile-menu-trigger",
  dropdownMenu: ".menu__dropdown-list",
  input: "input[type=checkbox]"
};

const classes = {
  menuOpener: "menu__opener"
};

const modifier = {
  menuOpened: "menu-opened"
};

const properties = {
  height: "--dropdown-height"
};

class Menu {
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
    this.openers = [...this.container.querySelectorAll(selector.input)]
    this.menus = [...this.container.querySelectorAll(selector.dropdownMenu)]
  }

  initEvents() {
    setTimeout(() => {
      this.setMenuHeight();
    }, 1000);

    document.addEventListener("click", this.closeDropdownMenu.bind(this));
  }

  setMenuHeight() {
    if (!this.menus.length) return false;

    this.menus.forEach(menu => {
      let height = menu.getBoundingClientRect().height;

      console.log(height);

      menu.style.setProperty(
        `${properties.height}`,
        `${height}px`
      );
    })
  }

  // toggle class on click on mobile menu trigger and close all dropdowns when menu closed
  closeDropdownMenu(e) {
    let target = e.target;
    const menuTrigger = target.parentElement.querySelector(selector.menuTrigger);
    const className = target.classList.contains(classes.menuOpener);

    if (!className) { target = e.target.closest(selector.menuTrigger) }

    !menuTrigger?.checked ? (
      target.classList.remove(modifier.menuOpened),
      this.openers.forEach((opener) => {
        opener.checked = false
      })
    ) : (
      menuTrigger === target ? target.classList.add(modifier.menuOpened) : null
    )
  }
}

const menu = new Menu(document.querySelector('.menu'));

menu.init();
