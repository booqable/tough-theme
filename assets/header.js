const selectors = {
	body: "body",
	previewBar: ".preview-bar__container",
	topBar: ".anoncement-bar"
};

const classes = {
	resizeClass: "resize-active",
	loaded: "loaded"
};

const modifiers = {
	scrolled: "page-scrolled"
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
		this.previewBar = this.container.querySelector(selectors.previewBar);
		this.topBar = this.container.querySelector(selectors.topBar);
		this.body = document.querySelector(selectors.body);
		this.lastScroll = 0;
		this.timer = undefined;
	}

	initEvents() {
		window.addEventListener("scroll", this.setPropsHeaderOnScroll.bind(this));
		window.addEventListener("resize", this.getHeaderHeight.bind(this));
		window.addEventListener("resize", this.setResizeClass.bind(this));
		window.addEventListener("DOMContentLoaded", this.removeLoadingClass.bind(this));
		this.getHeaderHeight();
	}

	// get height of header
	getHeaderHeight() {
		const headerHeight = this.container.getBoundingClientRect().height;

		document.documentElement.style.setProperty(
			"--header-height",
			`${Math.floor(headerHeight) - 1}px`
		);
	}

	// set class while resize window
	setResizeClass() {
		this.body.classList.add(classes.resizeClass);
		clearTimeout(this.timer);

		this.timer = setTimeout(() => {
			this.body.classList.remove(classes.resizeClass);
		}, 200);
	};

	// remove class after loading content
	removeLoadingClass() {
		this.body.classList.add(classes.loaded);
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