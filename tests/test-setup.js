// test-setup.js

import o from "ospec"
import "fake-indexeddb/auto"
import a from "fake-local-storage"
import jsdom from "jsdom"
import _ from "lodash"
var dom = new jsdom.JSDOM("", {
	// So we can get `requestAnimationFrame`
	pretendToBeVisual: true
})
a()

// Fill in the globals Mithril needs to operate. Also, the first two are often
// useful to have just in tests.
global.window = dom.window
global.document = dom.window.document
global.requestAnimationFrame = dom.window.requestAnimationFrame
global.window.mockery = true
global._ = _
global.Headers = function () { }
global.fetch = () => Promise.resolve({ json: () => [] })
global.API_URL = ''
global.BUILD_TIME = ''

// Require Mithril to make sure it loads properly.
//import "mithril"

// And now, make sure JSDOM ends when the tests end.
o.after(function () {
	dom.window.close()
})
