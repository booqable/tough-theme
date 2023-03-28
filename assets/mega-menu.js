const selector = {
  // header: ".header",
  menuTrigger: "#mobile-menu-trigger",
  input: "input[type=checkbox]"
};

const classes = {
  // headerSticky: "header--sticky",
  menuOpener: "menu__opener"
};

const modifier = {
  // headerSticky: "header--sticky",
  menuOpened: "menu-opened"
};

// const styles = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0
// }

class Menu {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) {
      return false;
    }

    // this.initElements();
    // this.initEvents();
  // }

  // initElements() {
    // this.header = document.querySelector(selector.header);
    this.openers = [...this.container.querySelectorAll(selector.input)];
  // }

  // initEvents() {
    document.addEventListener("click", this.closeDropdownMenu.bind(this));
  }

  // toggle class on click on mobile menu trigger and close all dropdowns when menu closed
  closeDropdownMenu(e) {
    let target = e.target;
    const menuTrigger = target.parentElement.querySelector(selector.menuTrigger);
    const className = target.classList.contains(classes.menuOpener);

    if (!className) { target = e.target.closest(selector.menuTrigger) }

    !menuTrigger?.checked
      ? (
        // !this.header.classList.contains(classes.headerSticky)
          // ? Object.assign(this.header.style, styles)
          // : console.log('read'),
        target.classList.remove(modifier.menuOpened),
        this.openers.forEach((opener) => {
          opener.checked = false
        })
      )
      : (
        // !this.header.classList.contains(classes.headerSticky)
          // ? (
              // const {position, top, left, right ...newStyles} = styles,

              // Object.assign(this.header.style, newStyles)
            // )
          // : console.log('read'),
        menuTrigger === target ? target.classList.add(modifier.menuOpened) : null
      )
  }

  // Positioning header when it is NOT sticky and mobile menu is opened
  // headerPositioning() {
  //   if (!this.header.classList.contains(classes.headerSticky)) return false;

  //   let headerHeight = this.header.getBoundingClientRect().height;
  //   this.container.

  //   this.header.classList.add(modifier.headerSticky)

  //   console.log(headerHeight)
  // }
}

const menu = new Menu(document.querySelector('.menu'));

menu.init();
