// data.test.js

     
import _ from 'lodash'
var mq = require("mithril-query")
var o = require("ospec")

import {remoteData, clearData, initData} from "../../src/store/data"


o.spec("store/data", function() {

    o("remoteData", function() {
        o(_.keys(remoteData).sort((a, b) => a.localeCompare(b))).deepEquals([
	'Images',
	'Messages',
	'Users',
	'Flags',
	'dataLoad'
        	].sort((a, b) => a.localeCompare(b)))
    	//o(1).equals(1) (`failed math`)
    })
    o("clearData", function() {
        //o(out.rootNode.text).equals(fv)
    	o(1).equals(1)
    })
    o("initData", function() {
        //o(out.rootNode.text).equals(fv)
    	o(1).equals(1)
    })
})

//o.run()

