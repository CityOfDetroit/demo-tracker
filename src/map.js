var mapboxgl = require('mapbox-gl')
import Helpers from './helpers.js'

const Map = {
  addGeoJsonSource: function(map, slug, url) {
    map.addSource(slug, {
      "type": "geojson",
      "data": url
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