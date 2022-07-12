// NameField.test.js



var mq = require("mithril-query")
import { describe, expect, it } from 'vitest';

import NameField from "../../../src/components/fields/NameField"

describe("NameField", function () {
    it("attrs.fieldValue display:" + `NameField should show fieldValue`, function () {
        const fv = 'fieldValue Test'
        var out = mq(NameField, { fieldValue: fv })
        //console.log(fv)
        //console.dir(out)
        expect(out.rootNode.text).toEqual(fv)
        //expect(1).toEqual(1) (`failed math`)
    })
})

//o.run()