// NameField.test.js

     

var mq = require("mithril-query")
var o = require("ospec")

import MyComponent from "../../../src/components/fields/NameField.jsx"

o.spec("NameField", function() {
	const fv = 'fieldValue Test'
    var out = mq(MyComponent, {fieldValue: fv})
	//console.log(fv)
    //console.dir(out)
    o("attrs.fieldValue display", function() {
        o(out.rootNode.text).equals(fv) `NameField should show fieldValue`
    	//o(1).equals(1) (`failed math`)
    })
})

o.run()