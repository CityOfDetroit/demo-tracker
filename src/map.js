var mapboxgl = require('mapbox-gl')

const Map = {
  addGeoJsonSource: function(map, slug, url) {
    map.addSource(slug, {
      "type": "geojson",
      "data": url
    })
  },

  makePopup: function(map, feature, template) {
    let html = `
    <h4>${template.title}</h4>
    ${template.columns.map(c => {
      return `<i>${c.name}</i>: ${eval(`feature.properties.${c.field}`)}`}).join("<br/>")}
    `
    
    let popup = new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(html)
      .addTo(map);
    return popup
  }
}

export default Map;