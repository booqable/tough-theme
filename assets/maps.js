class Map {
  constructor(block) {
    this.block = block;

    this.selector = {
      map: ".map"
    };

    this.attr = {
      id: "id",
      address: "data-address"
    };

    this.elem = {
      div: "div"
    };

    this.classes = {
      error: "map__error",
      noImage: "no-image"
    };

    this.zoom = 18;
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.maps = this.block.querySelectorAll(this.selector.map);
  }

  events() {
    this.createMap();
  }

  createMap() {
    if (!this.maps.length) return false;

    this.maps.forEach(map => {
      const id = map.getAttribute(this.attr.id),
            attr = map.getAttribute(this.attr.address),
            address = attr.replace("<p>", "").replace("</p>", ""),
            errorMessage = `${address} - is not a valid address, please check it again`,
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
        div.innerHTML = errorMessage;
        this.block.parentElement.classList.add(this.classes.noImage);
        return map.appendChild(div);
      }

      getData().then(data => {
        data.length ? renderMap(data) : message();
      });
    });
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
