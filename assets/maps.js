class Map {
  constructor(block) {
    this.block = block;

    this.selector = {
      map: ".map",
      link: ".tabs__link"
    };

    this.attr = {
      id: "id",
      href: "href",
      address: "data-address"
    };

    this.elem = {
      div: "div"
    };

    this.classes = {
      error: "map__error",
      noImage: "no-image"
    };

    this.message = 'is not a valid address, please check it again';
    this.linkArr = [];
    this.zoom = 18;
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.maps = this.block.querySelectorAll(this.selector.map);
    this.links = this.block.querySelectorAll(this.selector.link);
  }

  events() {
    this.createMap();
  }

  createMap() {
    if (!this.maps.length) return false;

    this.maps.forEach(map => {
      const id = map.getAttribute(this.attr.id),
        address = map.getAttribute(this.attr.address),
        url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;

      const getData = async () => {
        try {
          const res = await fetch(url);
          return await res.json();
        } catch (error) {
          console.log(error);
        }
      };

      const renderMap = (obj) => {
        const layers = [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ];

        const interaction = ol.interaction.defaults.defaults({
          mouseWheelZoom: false
        })

        new ol.Map({
          target: id,
          layers: layers,
          interactions: interaction,
          view: new ol.View({
            center: ol.proj.fromLonLat([obj[0]?.lon, obj[0]?.lat]),
            zoom: this.zoom
          })
        });
      }

      const message = () => {
        const div = document.createElement(this.elem.div);
        div.classList.add(this.classes.error);
        div.innerHTML = `${address} - ${this.message}`;
        this.block.parentElement.classList.add(this.classes.noImage);
        return map.appendChild(div);
      }

      getData().then(data => {
        data.length
          ? (renderMap(data), this.getUrl(data))
          : message()
      });
    });
  }

  getUrl(data) {
    if (!this.links.length) return false;

    const link = `https://www.openstreetmap.org/?mlat=4${data[0].lat}&amp;mlon=${data[0].lon}#map=${this.zoom}/${data[0].lat}/${data[0].lon}`
    this.linkArr.push(link);
    this.setUrl(this.linkArr);
  }

  setUrl(arr) {
    this.links.forEach((link, i) => {
      const valueIndex = Math.floor(i / 2);
      link.setAttribute(this.attr.href, arr[valueIndex]);
      console.log(link);
      console.log(i);


    })
  }
}

const initMap = (el = ".locations__wrapper") => {
  const nodes = document.querySelectorAll(el);

  if (!nodes.length) return false;

  nodes.forEach(node => {
    const maps = new Map(node);
    maps.init();
  });
};

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initMap()
});
