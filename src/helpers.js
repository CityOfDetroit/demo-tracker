const Helpers = {
  makeParamString: function(p) {
    return Object.keys(p).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(p[k])}`).join("&") 
  },

  makeSlug: function(string) {
    return string.toLowerCase();
  },

  makePopupHtml: function(props, template) {
    console.log(props)
    console.log(template)
  }
}

export default Helpers;
