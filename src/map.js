var mapboxgl = require('mapbox-gl')
import Helpers from './helpers.js'

const Map = {
  addGeoJsonSource: function(map, slug, url) {
    map.addSource(slug, {
      "type": "geojson",
      "data": url
    })
  },

  addHighlightLayer: function(map) {
    map.addSource('highlight', {
      type: 'geojson',
      data: {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [0,0]
              }
          }]
      }
   });

    map.addLayer({
      "id": "highlighter",
      "type": "circle",
      "source": "highlight",
      "layout": {
          "visibility": "visible"
      },
      "paint": {
        "circle-radius": 2.5,
        "circle-color": "rgba(255,0,0,1)",
        "circle-stroke-width": 5,
        "circle-stroke-color": "rgba(255,0,0,0.3)"
      }
    }, 'road-subway');
  },

  setHighlightLayer: function(map, coords) {
    map.getSource('highlight').setData({
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [coords.x, coords.y]
              }
          }]
      })
  },

  makePopup: function(map, features, yaml) {
    let items = []
    
    features.forEach(f => {
      let template = yaml[f.layer.source].popup
      let ft_html =`
      <h4>${template.title}</h4>
      ${template.columns.map(c => {
        return `<i>${c.name}</i>: ${Helpers.formatPopupValue(eval(`f.properties.${c.field}`), c.type)} `}).join("<br/>")}
      `
      items.push(ft_html)
    })

    let popup = new mapboxgl.Popup()
      .setLngLat(features[0].geometry.coordinates)
      .setHTML(`${items.join("<hr/>")}`)
      .addTo(map);
    return popup
  }
}

export default Map;