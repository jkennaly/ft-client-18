// ComposedNameField.test.js



var mq = require("mithril-query")
import { describe, expect, it } from 'vitest';

import ComposedNameField from "../../../src/components/fields/ComposedNameField"

describe("ComposedNameField", function () {
    it("attrs.fieldValue display:" + `ComposedNameField should show fieldValue`, function () {
        const fv = 'fieldValue Test'
        var out = mq(ComposedNameField, { fieldValue: fv })
        //console.log(fv)
        //console.dir(out)
        expect(out.rootNode.text).toEqual(fv)
        //expect(1).toEqual(1) (`failed math`)
    })
})

//o.run()