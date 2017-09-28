var mapboxgl = require('mapbox-gl');
var yaml = require('yamljs');
var _ = require('lodash');

import Helpers from './helpers.js'
import Socrata from './socrata.js'
import Map from './map.js'
import Legend from './legend.js'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cityofdetroit/cj83zovzu08i92snucwtcd2yh',
    center: [-83.091, 42.350],
    zoom: 10.5
})

const ds = yaml.load('datasets.yml')

map.on('load', function() {

    let interactiveLayers = []

    // loop through datasets
    _.each(ds, (ds => {
        let catUl = Legend.addCategory(document.querySelector("#legend"), ds)
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
            l.layer_name = `${ds.slug}_${Helpers.makeSlug(l.name)}`;
            interactiveLayers.push(l.layer_name)
            Legend.addLayer(catUl, l)                        
            map.addLayer({
                "id": l.layer_name,
                "type": l.type,
                "source": ds.slug,
                "layout": l.layout,
                "paint": l.paint
            },
            // insert before the roads layer 
            'road-subway')
            // apply filter if exists
            if (l.filter) {
                map.setFilter(l.layer_name, l.filter)
            }
        }))
    }))

    // add event listeners
    let inputs = document.querySelectorAll("input")
    inputs.forEach(i => {
        i.addEventListener("change", c => {
            let layer = c.target.value
            if (c.target.checked) {
                map.setLayoutProperty(layer, "visibility", "visible")
            } 
            else {
                map.setLayoutProperty(layer, "visibility", "none")
            }
        })
    })

    // add popup listener on interactiveLayers
    let popup = null
    map.on('click', e => {
        if (popup) {
            popup.close()
        }
        let features = map.queryRenderedFeatures(e.point, { layers: interactiveLayers })
        if (features.length > 0) {
            Map.makePopup(map, features, ds)
        }
    })
})
