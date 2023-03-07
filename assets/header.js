const selectors = {
	body: "body",
	previewBar: ".preview-bar__container",
	topBar: ".js-anoncement-bar",
	header: ".js-header-sticky"
};

const classes = {
};

const modifiers = {
	headerSticky: "header--sticky",
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

		console.log(this.topBar);
		// this.initTopOffset();
	}

	initTopOffset() {
		if (!this.previewBar) {
			return false;
		}


	}

	initEvents() {
		window.addEventListener("scroll", this.initHeaderScroll.bind(this));
		window.addEventListener("resize", this.initHeaderHeight.bind(this));
	}

	initHeaderScroll() {
		const topBarHeight = this.topBar.offsetHeight;
		const headerHeight = this.container.offsetHeight;

		console.log(topBarHeight);
		console.log(headerHeight);

		if (!headerHeight) {
			return false;
		}

		const body = document.querySelector(selectors.body);

		if (window.scrollY > topBarHeight) {
			this.container.classList.add(modifiers.headerSticky);
			body.classList.add(modifiers.scrolled);
			this.initHeaderHeight();
		} else {
			this.container.classList.remove(modifiers.headerSticky);
			body.classList.remove(modifiers.scrolled);
			document.documentElement.style.setProperty("--header-height", "0");
		}
	}

	initHeaderHeight() {
		const topBarHeight = this.topBar.offsetHeight;
		const headerHeight = this.container.offsetHeight;

		console.log(topBarHeight);
		console.log(headerHeight);

		document.documentElement.style.setProperty(
			"--header-height",
			headerHeight + topBarHeight + "px"
		);

	}
}

const header = new StickyHeader(document.querySelector('.js-header-sticky'));

header.init();


// const classes = {
// 	active: "active",
// 	child: "only-child"
// };

// const modifiers = {
// 	active: "active",
// 	headerSticky: "header--sticky",
// 	overflow: "overflow-hidden-body",
// 	scrolled: "page-scrolled"
// };

// let breakpointTablet = 768;

// register("dynamic-header", {
// 	onLoad: function () {
// 		this.initElements();
// 		this.initEvents();
// 	},
// 	initElements: function () {
// 		this.searchContainer = this.container.querySelector(
// 			selectors.search.container
// 		);
// 		this.searchOpener = this.container.querySelector(selectors.search.open);
// 		this.searchCloser = this.container.querySelector(
// 			selectors.search.close
// 		);
// 		setTimeout(() => {
// 			this.searchCloserMobile = document.querySelector(
// 				selectors.search.closeMobile
// 			);
// 		}, 1000);
// 		this.container = this.container.querySelector(
// 			selectors.header.container
// 		);
// 		this.topBar = this.container.querySelector(selectors.topBar.container);
// 		this.mobileMenuOpener = this.container.querySelector(
// 			selectors.menuMobile.mobileMenuOpener
// 		);
// 		this.mobileMenuCloser = this.container.querySelector(
// 			selectors.menuMobile.mobileMenuCloser
// 		);
// 		this.mobileMenuContainer = this.container.querySelector(
// 			selectors.menuMobile.mobileMenuContainer
// 		);
// 		this.mobileParentLinkArray = [
// 			...this.container.querySelectorAll(
// 				selectors.menuMobile.mobileParentLink
// 			)
// 		];
// 		this.mobileDropdownMenuClose = [
// 			...this.container.querySelectorAll(
// 				selectors.menuMobile.mobileDropdownMenuClose
// 			)
// 		];
// 		this.desktopDropdownsArray = [
// 			...this.container.querySelectorAll(selectors.menuDesktop.container)
// 		];
// 		this.desktopMenuItemsArray = [
// 			...this.container.querySelectorAll(selectors.menuDesktop.item)
// 		];
// 	},
// 	initEvents: function () {
// 		this.initDesktopMenuOpenClose();
// 		this.initOnlyOneDropdownChild();
// 		this.searchOpener.addEventListener(
// 			"click",
// 			this.initSearchOpen.bind(this)
// 		);
// 		this.searchCloser.addEventListener(
// 			"click",
// 			this.initSearchClose.bind(this)
// 		);
// 		setTimeout(() => {
// 			this.searchCloserMobile.addEventListener(
// 				"click",
// 				this.initSearchClose.bind(this)
// 			);
// 		}, 1000);
// 		this.mobileMenuOpener.addEventListener(
// 			"click",
// 			this.initMobileMenuOpen.bind(this)
// 		);
// 		this.mobileMenuCloser.addEventListener(
// 			"click",
// 			this.initMobileMenuClose.bind(this)
// 		);
// 		this.mobileParentLinkArray.forEach((link) => {
// 			link.addEventListener(
// 				"click",
// 				this.initMobileDropdownOpen.bind(this)
// 			);
// 		});
// 		this.mobileMenuContainer.addEventListener(
// 			"click",
// 			this.initMobileDropdownClose.bind(this)
// 		);
// 		window.addEventListener("scroll", this.initHeaderScroll.bind(this));
// 		window.addEventListener("resize", this.initHeaderHeight.bind(this));
// 	},
// 	initSearchOpen: function () {
// 		if (!this.searchContainer) {
// 			return false;
// 		}

// 		if (window.innerWidth < breakpointTablet) {
// 			document
// 				.querySelector(selectors.body)
// 				.classList.add(modifiers.searchActive);
// 			this.searchContainer.classList.remove(modifiers.searchView);
// 		} else {
// 			document
// 				.querySelector(selectors.body)
// 				.classList.remove(modifiers.searchActive);
// 			this.searchContainer.classList.add(modifiers.searchView);
// 		}
// 	},
// 	initSearchClose: function () {
// 		if (!this.searchContainer) {
// 			return false;
// 		}

// 		document
// 			.querySelector(selectors.body)
// 			.classList.remove(modifiers.searchActive);
// 		this.searchContainer.classList.remove(modifiers.searchView);
// 	},
// 	initHeaderScroll: function () {
// 		const topBar = this.topBar.offsetHeight;
// 		const headerHeight = this.container.offsetHeight;

// 		if (!headerHeight) {
// 			return false;
// 		}

// 		const body = document.querySelector(selectors.body);

// 		if (window.scrollY > topBar) {
// 			this.container.classList.add(modifiers.headerSticky);
// 			body.classList.add(modifiers.scrolled);
// 			this.initHeaderHeight();
// 		} else {
// 			this.container.classList.remove(modifiers.headerSticky);
// 			body.classList.remove(modifiers.scrolled);
// 			document.documentElement.style.setProperty("--header-height", "0");
// 		}
// 	},
// 	initHeaderHeight: function () {
// 		const setHeaderHeight = () => {
// 			const headerHeight = this.container.offsetHeight;
// 			document.documentElement.style.setProperty(
// 				"--header-height",
// 				headerHeight + "px"
// 			);
// 		};

// 		setHeaderHeight();
// 	},
// 	overflowBody: function () {
// 		document
// 			.querySelector(selectors.body)
// 			.classList.toggle(modifiers.overflow);
// 	},
// 	initMobileMenuOpen: function (e) {
// 		const target = e.target;
// 		const opener = target.closest(selectors.menuMobile.mobileMenuOpener);

// 		if (!opener) {
// 			return false;
// 		}

// 		this.mobileMenuContainer.classList.add(modifiers.mobileMenuOpened);
// 		this.overflowBody();
// 	},
// 	initMobileMenuClose: function (e) {
// 		const target = e.target;
// 		const closer = target.closest(selectors.menuMobile.mobileMenuCloser);

// 		if (!closer) {
// 			return false;
// 		}

// 		this.mobileMenuContainer.classList.remove(modifiers.mobileMenuOpened);
// 		this.overflowBody();
// 	},
// 	initMobileDropdownOpen: function (e) {
// 		const target = e.target;
// 		const openerLink = target.closest(
// 			selectors.menuMobile.mobileParentLink
// 		);

// 		if (!openerLink) {
// 			return false;
// 		}

// 		this.mobileMenuContainer.classList.add(modifiers.mobileMenuOpened);
// 		openerLink.classList.add(modifiers.mobileDropdownOpened);
// 	},
// 	initMobileDropdownClose: function (e) {
// 		const target = e.target;
// 		const closerLink = target.closest(
// 			selectors.menuMobile.mobileDropdownMenuClose
// 		);

// 		if (!closerLink || !target) {
// 			return false;
// 		}

// 		this.mobileDropdownMenuClose.forEach((element) => {
// 			let parentMobLink = element.closest(
// 				selectors.menuMobile.mobileParentLink
// 			);
// 			parentMobLink.classList.remove(modifiers.mobileDropdownOpened);
// 		});
// 	},
// 	initOnlyOneDropdownChild: function () {
// 		if (!this.desktopDropdownsArray.length) {
// 			return false;
// 		}

// 		this.desktopDropdownsArray.forEach((child) => {
// 			const children = child.querySelectorAll(
// 				selectors.menuDesktop.dropItem
// 			);
// 			if (children.length === 1) {
// 				children[0].classList.add(classes.child);
// 			}
// 		});
// 	},
// 	initDesktopMenuOpenClose: function () {
// 		if (!this.desktopMenuItemsArray.length) {
// 			return false;
// 		}

// 		this.desktopMenuItemsArray.forEach((element) => {
// 			element.addEventListener("mouseover", function () {
// 				if (!element.classList.contains(classes.active)) {
// 					element.classList.add(modifiers.active);
// 				}
// 			});
// 			element.addEventListener("mouseout", function () {
// 				if (element.classList.contains(classes.active)) {
// 					element.classList.remove(modifiers.active);
// 				}
// 			});
// 		});
// 	}
// });
