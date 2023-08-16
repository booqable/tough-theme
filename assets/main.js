class Main {
  constructor(container) {
    this.container = container;

    this.selector = {
      input: "input",
      footer: "footer",
      search: "#search",
      image: ".focal-image",
      focus: "[data-focus]"
    };

    this.modifier = {
      loaded: "loaded",
      resize: "resize-active"
    };

    this.params = {
      q: "q",
      out: "out",
      true: "true",
      block: "block",
      footer: "footer",
      type: "message",
      section: "section"
    };

    this.props = {
      behavior: "smooth",
      block: "center"
    };

    this.data = {
      focalX: "data-focal-x",
      focalY: "data-focal-y",
      focus: "data-focus"
    };

    this.time = 500;
    this.timeScroll = 300;
  }

  init() {
    if (!this.container) {
      return false;
    }

    this.elements();
    this.events();
  }

  elements() {
    this.timer = undefined;
    this.footer = document.querySelector(this.selector.footer);
    this.search = document.querySelector(this.selector.search);
    if (this.search) this.input = this.search.querySelector(this.selector.input);
    this.url = new URL(window.location.href);
    this.focalImageTimeout;
  }

  events() {
    this.setLoadedClass();
    this.focalImages();
    if (this.search) this.searchInputAutoFill();
    this.notch();

    window.addEventListener("resize", this.notch.bind(this));
    window.addEventListener("resize", this.setResizeClass.bind(this));
    window.addEventListener("message", this.messagesListener.bind(this));
  }

  // adding class while resizing window
  setResizeClass() {
    this.container.classList.add(this.modifier.resize);
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.container.classList.remove(this.modifier.resize);
    }, this.time);
  }

  // adding class after loading content
  setLoadedClass() {
    this.container.classList.add(this.modifier.loaded);
  }

  // change focus positioning of image
  focalImages() {
    if (!window.imageFocus) {
      if (this.focalImageTimeout) clearTimeout(this.focalImageTimeout);

      this.focalImageTimeout = setTimeout(() => {
        initFocalImages();
      }, 10);

      return;
    }

    clearTimeout(this.focalImageTimeout);

    const images = document.querySelectorAll(this.selector.image);

    images.forEach(image => {
      const x = image.getAttribute(this.data.focalX),
            y = image.getAttribute(this.data.focalY);

      new window.imageFocus(image, {
        focus: {
          x: parseFloat(x) || 0,
          y: parseFloat(y) || 0,
        },
      });

      image.style.opacity = 1;
    });
  };

  // autofill search input field
  searchInputAutoFill() {
    const query = this.url.searchParams.get(this.params.q);

    if (!query) return false;

    this.input.value = query;
  }

  // scroll page to the focused element on the sidebar in the theme editor
  scrollToFocus(target) {
    target?.setAttribute(this.data.focus, this.params.true);

    setTimeout(() => {
      target?.scrollIntoView({ behavior: this.props.behavior, block: this.props.block });
    }, this.timeScroll);
  };

  // remove focus from element in the theme editor
  removeFocus() {
    const focuses = document.querySelectorAll(this.selector.focus);

    focuses?.forEach((node) => node.removeAttribute(this.data.focus));
  };

  messagesListener({ type, data, isTrusted }) {
    if (type !== this.params.type) return false;

    if (!!data && isTrusted) {
      this.removeFocus();

      let target;

      switch (data.type) {
        case this.params.out:
          this.removeFocus();
          break;

        case this.params.section:
          target = document.querySelector(`#${this.params.section}-${data.id}`);

          this.scrollToFocus(target);
          break;

        case this.params.block:
          target = document.querySelector(`#${this.params.section}-${data.sectionId} #${data.id}`);

          this.scrollToFocus(target);
          break;

        case this.params.footer:
          target = this.footer;

          this.scrollToFocus(target);
          break;
      }
    }
  };

  notch() {
    const doc = document.documentElement,
          styles = window.getComputedStyle(doc),
          topVal = parseInt(styles.getPropertyValue("--notch-top")),
          rightVal = parseInt(styles.getPropertyValue("--notch-right")),
          bottomVal = parseInt(styles.getPropertyValue("--notch-bottom")),
          leftVal = parseInt(styles.getPropertyValue("--notch-left")),
          propsArr = [topVal, rightVal, bottomVal, leftVal];

    let notch;

    propsArr.filter((e) => e > 0 );

    if (propsArr.length > 0) notch = true;

    this.deviceOrientation(doc, notch);
  };

  deviceOrientation(doc, notch) {
    const screen = {
      width : window.innerWidth,
      height : window.innerHeight
    };

    if (screen.width > screen.height) {
      doc.setAttribute("data-orientation", "landscape");
    } else {
      doc.setAttribute("data-orientation", "portrait");
    }

    console.log(screen.width);
    console.log(screen.height);
  }
}

const main = new Main(document.querySelector('body'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") main.init();
});
