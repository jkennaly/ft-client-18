// tests/components/App.test.js

     

var mq = require("mithril-query")
var o = require("ospec")

import App from "../../../src/components/layout/App.jsx"

o.spec("App", function() {
	var out = mq(App)
	//console.log('App out', out)
    o("attrs.fieldValue display", function() {
        o(out.rootNode.attrs.className).equals('App') `App class is App`
    	//o(1).equals(1) (`failed math`)
    })
})

//o.run()