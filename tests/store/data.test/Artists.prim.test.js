// Artists.prim.test.js
import o from "ospec"
import _ from 'lodash'

import { remoteData } from "../../../src/store/data"

o.spec("store/data Artist Primitives", function () {
    const artists = _.cloneDeep(remoteData.Artists)
    artists.clear()

    o("Artist boolean fields", function () {
        o(artists.core).equals(true)
    })
    o("Artist string fields", function () {
        o(artists.fieldName).equals('Artists')
        o(artists.baseEndpoint).equals('/api/Artists')
    })
    o("Artist number fields", function () {
        o(artists.lastRemoteLoad).equals(0)
        o(artists.lastRemoteCheck).equals(0)
        o(artists.remoteInterval).equals(3600)
        o(artists.subjectType).equals(2)
    })
})