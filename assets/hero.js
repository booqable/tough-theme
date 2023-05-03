class Hero {
  constructor(section) {
    this.section = section;

    this.selector = {
      vision: ".hero__vision",
      video: ".hero__video-id",
      player: ".hero__video",
      button: ".carousel__trigger",
      timer: ".carousel__timer"
    }

    this.classes = {
      next: "next",
      init: "initialized"
    }

    this.id = {
      slide: "slide",
      id: "id"
    }

    this.props = {
      video: "video"
    }

    this.options = {
      hex: "--color-primary-foreground",
      rgb: "--color-primary-foreground-rgb"
    }

    this.current = 1
  }

  init() {
    if (!this.section) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.visions = [...this.section.querySelectorAll(this.selector.vision)];
    this.buttons = [...this.section.querySelectorAll(this.selector.button)];
    this.timer = this.section.querySelector(this.selector.timer);
  }

  events() {
    this.toRgb();
    // this.sliderInit();
    // this.eventRotate();
    // this.autoRotate();
    // this.videoInit();
  }

  sliderInit() {
    if (!this.timer) return false;

    this.timer.parentElement.classList.add(this.classes.init);
  }

  toRgb() {
    if (!this.visions.length) return false;

    this.visions.forEach(vision => {
      const init = new window.ToRgb(vision, this.options);
      init.init();
    })
  }

  autoRotate() {
    const timer = this.timer.value * 1000;

    if (timer === 0 ) return false;

    const interval = setInterval(() => {
      this.eventRotate()
    }, timer)

    return () => {
      clearInterval(interval)
    }
  }

  eventRotate() {
    if (!this.buttons.length) return false;

    const toggler = document.querySelector(`#${this.id.slide}-${this.current}`)

    toggler.click();

    this.current === this.buttons.length
      ? this.current = 1
      : this.current += 1
  }

  videoInit() {
    if (!this.visions.length) return false;

    this.visions.forEach(item => {
      const videoId = item.querySelector(this.selector.video).value;

      if (!videoId) return false;

      const playerId = item.querySelector(this.selector.player).id;

      this.video(videoId, playerId);

    })
  }

  video(video, player) {
    // Create an <iframe> (and YouTube player) after the API code downloads.
    const instance = new YT.Player(player, {
      width: '988',
      height: '556',
      videoId: video,
      playerVars: {
        'playlist': video,
        'playsinline': 1,
        'autoplay': 1,
        'mute': 1,
        'loop': 1,
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'enablejsapi': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    // API call this function when the video player is ready.
    function onPlayerReady(e) {
      e.target.playVideo();
    }

    // API call this function when the video player is changing state.
    // It helps resolve an issue of embeddable youtube video into the site
    // when it's not autoplayable after screen locked and unlocked
    function onPlayerStateChange(e) {
      if (e.target.getPlayerState() !== 3) {
        e.target.playVideo();
      }
    }
  }
}

function initHero(selector = ".hero") {
  const sections = [...document.querySelectorAll(selector)];

  if (!sections.length) return false;

  sections.forEach(section => {
    const hero = new Hero(section);
    hero.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initHero()
});
