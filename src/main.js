var mapboxgl = require('mapbox-gl');
var yaml = require('yamljs');
var _ = require('lodash');

import Helpers from './helpers.js'
import Socrata from './socrata.js'
import Map from './map.js'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cityofdetroit/cj83q8rph01c02sr3bk20d91e',
    center: [-83.091, 42.350],
    zoom: 10.5
})

const ds = yaml.load('datasets.yml')

map.on('load', function() {

    let interactiveLayers = []

    // loop through datasets
    _.each(ds, (ds => {
        // get URL based on the source.type
        switch (ds.source.type) {
            case "socrata":
                let url = Socrata.makeURL(ds.source.url, 'geojson', ds.source.params)
                Map.addGeoJsonSource(map, ds.slug, url)
                break
            case "esri":
                // let url = Esri.makeURL(...)
                // Map.addGeoJsonSource(map, ds.slug, url)
                break
        }

        // loop through layers
        _.each(ds.layers, (l => {
            // replace the name & push to interactiveLayers
            l.name = `${ds.slug}_${Helpers.makeSlug(l.name)}`;
            interactiveLayers.push(l.name)
            map.addLayer({
                "id": l.name,
                "type": l.type,
                "source": ds.slug,
                "layout": l.layout,
                "paint": l.paint
            }, 'road-subway')
            // apply filter
            if (l.filter) {
                map.setFilter(l.name, l.filter)
            }
        }))
    }))

    let popup = null
    map.on('click', e => {
        if (popup) {
            popup.close()
        }
        let features = map.queryRenderedFeatures(e.point, { layers: interactiveLayers })
        if (features.length > 0) {
            Map.makePopup(map, features[0], ds[features[0].layer.source].popup)
        }
    })
})
