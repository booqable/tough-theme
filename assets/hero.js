class Hero {
  constructor(block) {
    this.block = block;

    this.selector = {
      vision: ".hero__vision",
      video: ".hero__video-id",
      player: ".hero__video",
    }

    this.options = {
      hex: "--color-primary-foreground",
      rgb: "--color-primary-foreground-rgb"
    }
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.arr = [...this.block.querySelectorAll(this.selector.vision)];
  }

  events() {
    this.toRgb();
    this.videoInit();
  }

  toRgb() {
    if (!this.arr.length) return false;

    this.arr.forEach(val => {
      const init = new window.ToRgb(val, this.options);
      init.init();
    })
  }

  videoInit() {
    if (!this.arr.length) return false;

    this.arr.forEach(val => {
      const el = val.querySelector(this.selector.video),
            id = el?.value;

      if (!id) return false;

      const box = val.querySelector(this.selector.player).id;

      this.video(id, box);
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

function initHero(el = ".hero") {
  const arr = [...document.querySelectorAll(el)];

  if (!arr.length) return false;

  arr.forEach(val => {
    const hero = new Hero(val);
    hero.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initHero()
});
