var _ = require('lodash')

const Legend = {
  addCategory: function(legendDiv, layer) {
    let div = document.createElement("div")
    div.id = `${layer.slug}`
    div.classList = ['dataset-item']
    div.innerHTML = `<h5>${layer.name} <a href="https://data.detroitmi.gov/d/${layer.source.url}">(source)</a></h5><div class='legend-layer-list'></div>`
    legendDiv.appendChild(div)
    return div
  },

  addLayer: function(categoryUl, layer) {
    let div = document.createElement("div")
    div.classList = ['layer-item']
    if (layer.legend) {
      let style = layer.legend.join("")
      console.log(style)
    }
    div.innerHTML = `
          <div id="${layer.layer_name}_icon" class="legend-icon" style="${layer.legend ? layer.legend.join("") : ''}"> </div>
          <input type="checkbox" class="layer-toggle" id="${layer.layer_name}" value="${layer.layer_name}">
          <label for="${layer.layer_name}">${layer.name}</label>`
    categoryUl.appendChild(div)
    return div
  }
}

export default Legend;