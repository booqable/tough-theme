const selectors = {
	body: "body",
	previewBar: ".preview-bar__container",
	topBar: ".anoncement-bar",
	menu: ".menu",
	menuTrigger: "#mobile-menu-trigger",
	input: "input[type=checkbox]"
};

const classes = {
	menuOpener: "menu__opener"
};

const modifiers = {
	loaded: "loaded",
	resizeClass: "resize-active",
	scrolled: "page-scrolled",
	menuOpened: "menu-opened"
};

class StickyHeader {
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
		this.body = document.querySelector(selectors.body);
		this.topBar = this.container.querySelector(selectors.topBar);
		this.menu = this.container.querySelector(selectors.menu);
		this.lastScroll = 0;
		this.timer = undefined;

		this.getHeaderHeight();
	}

	initEvents() {
		window.addEventListener("scroll", this.setPropsHeaderOnScroll.bind(this));
		window.addEventListener("resize", this.getHeaderHeight.bind(this));
		window.addEventListener("resize", this.setResizeClass.bind(this));
		window.addEventListener("DOMContentLoaded", this.removeLoadingClass.bind(this));
		document.addEventListener("click", this.closeDropdownMenu.bind(this));
	}

	// get height of header
	getHeaderHeight() {
		const previewBar = document.querySelector(selectors.previewBar);
		const headerHeight = this.container.getBoundingClientRect().height;

		if (previewBar) {
			headerHeight += previewBar.getBoundingClientRect().height;
		}

		document.documentElement.style.setProperty(
			"--header-height",
			`${Math.floor(headerHeight) - 1}px`
		);
	}

	// set class while resize window
	setResizeClass() {
		this.body.classList.add(modifiers.resizeClass);
		clearTimeout(this.timer);

		this.timer = setTimeout(() => {
			this.body.classList.remove(modifiers.resizeClass);
		}, 200);
	};

	// remove class after loading content
	removeLoadingClass() {
		this.body.classList.add(modifiers.loaded);
	}

	// toggle class on click on mobile menu trigger and close all dropdowns when menu closed
	closeDropdownMenu(e) {
		let target = e.target;
		const menuTrigger = target.parentElement.querySelector(selectors.menuTrigger);
		const className = target.classList.contains(classes.menuOpener);
		const openers = [...this.menu.querySelectorAll(selectors.input)]

		if (!className) { target = e.target.closest(selectors.menuTrigger) }

		!menuTrigger?.checked ? (
			target.classList.remove(modifiers.menuOpened),
			openers.forEach((opener) => {
				opener.checked = false
			})
		) : (
			!className ? target.classList.add(modifiers.menuOpened) : null
		)
	}

	// set properties when scroll page
	setPropsHeaderOnScroll() {
		if (!this.topBar) {
			return false;
		}

		this.currentScroll = window.scrollY;

		if (this.currentScroll <= 180) {
			this.body.classList.remove(modifiers.scrolled);
			document.documentElement.style.setProperty(
				'--header-transform',
				'0px'
			);
			return;
		}

		if (
			this.currentScroll > this.lastScroll &&
			!this.body.classList.contains(modifiers.scrolled)
		) {
			// down
			this.body.classList.add(modifiers.scrolled);
			document.documentElement.style.setProperty(
				'--header-transform',
				`-${this.topBar.offsetHeight}px`
			);
		} else if (
			this.currentScroll < this.lastScroll - 10 &&
			this.body.classList.contains(modifiers.scrolled)
		) {
			// up
			this.body.classList.remove(modifiers.scrolled);
			document.documentElement.style.setProperty(
				'--header-transform',
				'0px'
			);
		}

		this.lastScroll = this.currentScroll;

	}
}

const header = new StickyHeader(document.querySelector('.header-sticky'));

header.init();