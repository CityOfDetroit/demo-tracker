var mapboxgl = require('mapbox-gl');
var yaml = require('yamljs');
var _ = require('lodash');

import Helpers from './helpers.js'
import Socrata from './socrata.js'
import Map from './map.js'
import Legend from './legend.js'
import Locate from './locate.js'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajhmenkzejYwNm56MnFvNmF1anhmaXN6In0.hOESlZup6yOhJB8bH9kiWA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cityofdetroit/cjctinhmf03my2rmqnb9ct13z',
    center: [-83.091, 42.350],
    zoom: 10.5,
    maxBounds: [
        [-83.427803, 42.085192],
        [-82.770451, 42.62023]
    ]
})


// geolocation control
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}), 'top-left');

// nav control
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// load datasets.yml
const ds = yaml.load('datasets.yml')

map.on('load', function() {

    Map.addHighlightLayer(map)
    let interactiveLayers = ['dlba-parcels-vacant']

    // loop through datasets
    _.each(ds, (ds => {
        // get URL based on the source.type
        switch (ds.source.type) {
            case "socrata":
                let url = Socrata.makeURL(ds.source.url, 'geojson', ds.source.params)
                console.log(url)
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
            let catUl = document.querySelector(`#category-${ds.category}`)
            Legend.addLayer(catUl, l, ds.source.link)                        
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

    // mouseover/mouseout crosshair
    interactiveLayers.forEach(il => {
        map.on('mouseenter', il, function (e) {
            map.getCanvas().style.cursor = 'crosshair'
        });
        map.on('mouseout', il, function (e) {
            map.getCanvas().style.cursor = ''
        });
    })

    // listen for toggle on individual layers
    let inputs = document.querySelectorAll(".layer-toggle")
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

    // listen for Enter keypress on address/intersection search bar
    let search = document.querySelector("#locate")
    search.addEventListener("keypress", e => {
        if(e.key == 'Enter') {
            Locate.geocodeAddress(e.target.value).then(result => {
                let coords = result['candidates'][0]['location']
                map.flyTo({center: [coords.x, coords.y], zoom: 17})
                Map.setHighlightLayer(map, coords)         
            })
        }
    })

    // listen for legend toggle
    let toggle = document.querySelector("#legend-toggle")
    toggle.style.borderTop = "8px solid black"
    toggle.addEventListener("click", e => {
        let toggleable = document.querySelector("#legend-toggleable")
        if (toggleable.style.display == 'none') {
            e.target.style.borderTop = "8px solid black"
            e.target.style.borderBottom = ""
            toggleable.style.display = 'block'
        } else {
            e.target.style.borderBottom = "8px solid black"
            e.target.style.borderTop = ""
            toggleable.style.display = 'none'       
        }

    })

    // listen to mapClick on interactiveLayers, and make popup
    let popup = null
    map.on('click', e => {
        if (popup) {
            popup.close()
        }
        let features = map.queryRenderedFeatures(e.point, { layers: interactiveLayers })
        if (features.length > 0) {
            Map.makePopup(map, features, ds, e.lngLat)
        }
    })
})
