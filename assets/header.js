const selectors = {
	body: "body",
	previewBar: ".preview-bar__container",
	topBar: ".anoncement-bar"
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
		this.lastScroll = 0;
	}

	initEvents() {
		window.addEventListener("scroll", this.initHeaderScroll.bind(this));
		window.addEventListener("resize", this.initHeaderHeight.bind(this));
		this.initHeaderHeight();
	}

	initHeaderScroll() {
		if (!this.topBar) {
			return false;
		}

		const body = document.querySelector(selectors.body);
		this.currentScroll = window.scrollY;

		if (this.currentScroll <= 180) {
			body.classList.remove(modifiers.scrolled);
			document.documentElement.style.setProperty(
				'--header-transform',
				'translateY(0)'
			);
			return;
		}

		if (
			this.currentScroll > this.lastScroll &&
			!body.classList.contains(modifiers.scrolled)
		) {
			// down
			body.classList.add(modifiers.scrolled);
			document.documentElement.style.setProperty(
				'--header-transform',
				`translateY(-${this.topBar.offsetHeight}px)`
			);
		} else if (
			this.currentScroll < this.lastScroll - 10 &&
			body.classList.contains(modifiers.scrolled)
		) {
			// up
			body.classList.remove(modifiers.scrolled);
			document.documentElement.style.setProperty(
				'--header-transform',
				'translateY(0)'
			);
		}

		this.lastScroll = this.currentScroll;

	}

	initHeaderHeight() {
		const headerHeight = this.container.getBoundingClientRect().height;

		document.documentElement.style.setProperty(
			"--header-height",
			`${Math.floor(headerHeight)}px`
		);
	}
}

const header = new StickyHeader(document.querySelector('.header-sticky'));

header.init();