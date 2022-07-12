// Artists.prim.test.js
import { describe, expect, it } from 'vitest';
import _ from 'lodash'

import { remoteData } from "../../../src/store/data"

describe("store/data Artist Primitives", function () {
    const artists = _.cloneDeep(remoteData.Artists)
    artists.clear()

    it("Artist boolean fields", function () {
        expect(artists.core).toEqual(true)
    })
    it("Artist string fields", function () {
        expect(artists.fieldName).toEqual('Artists')
        expect(artists.baseEndpoint).toEqual('/api/Artists')
    })
    it("Artist number fields", function () {
        expect(artists.lastRemoteLoad).toEqual(0)
        expect(artists.lastRemoteCheck).toEqual(0)
        expect(artists.remoteInterval).toEqual(3600)
        expect(artists.subjectType).toEqual(2)
    })
})