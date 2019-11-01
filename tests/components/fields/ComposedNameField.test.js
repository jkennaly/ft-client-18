// ComposedNameField.test.js

     

var mq = require("mithril-query")
var o = require("ospec")

import ComposedNameField from "../../../src/components/fields/ComposedNameField.jsx"

o.spec("ComposedNameField", function() {
	const fv = 'fieldValue Test'
    var out = mq(ComposedNameField, {fieldValue: fv})
	//console.log(fv)
    //console.dir(out)
    o("attrs.fieldValue display", function() {
        o(out.rootNode.text).equals(fv) `ComposedNameField should show fieldValue`
    	//o(1).equals(1) (`failed math`)
    })
})

//o.run()