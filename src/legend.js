var _ = require('lodash')

const Legend = {

  addLayer: function(categoryUl, layer, url) {
    let div = document.createElement("div")
    div.classList = ['layer-item']
    if (layer.legend) {
      let style = layer.legend.join("")
    }
    div.innerHTML = `
          <div id="${layer.layer_name}_icon" class="legend-icon" style="${layer.legend ? layer.legend.join("") : ''}"> </div>
          <input type="checkbox" class="layer-toggle" id="${layer.layer_name}" value="${layer.layer_name}">
          <label for="${layer.layer_name}">${layer.name} <a href=${url}>(source)</a></label>`
    categoryUl.appendChild(div)
    return div
  }
}

export default Legend;