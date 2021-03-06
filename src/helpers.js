var moment = require('moment')

const Helpers = {
  makeParamString: function(p) {
    return Object.keys(p).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(p[k])}`).join("&") 
  },

  makeSlug: function(string) {
    return string.toLowerCase();
  },

  formatPopupValue: function(value, type) {
    switch(type) {
      case "text":
        let returnVal = value ?  value : '-'
        return returnVal
        break;
      case "date":
        if (value) {
          return moment(value).format('ll')          
        }
        else { return 'n/a' }
        break;
      case "money":
        return '$' + parseInt(value).toFixed(2)
        break
    }
  }

}

export default Helpers;
