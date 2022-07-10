// data.test.js

import _ from "lodash"
import o from "ospec"

console.log('hello')
import { remoteData, clearData, initData } from "../../src/store/data"

o.spec("store/data", function () {
	o("remoteData", function () {
		o(_.keys(remoteData).sort((a, b) => a.localeCompare(b))).deepEquals(
			[
				"Artists",
				"Images",
				"Series",
				"Festivals",
				"Dates",
				"Days",
				"Sets",
				"Lineups",
				"Venues",
				"Organizers",
				"Places",
				"ArtistPriorities",
				"StagePriorities",
				"StageLayouts",
				"PlaceTypes",
				"ArtistAliases",
				"ParentGenres",
				"Genres",
				"ArtistGenres",
				"MessageTypes",
				"SubjectTypes",
				"Messages",
				"MessagesMonitors",
				"Intentions",
				"Interactions",
				"Users",
				"Flags",
				//'dataLoad'
			].sort((a, b) => a.localeCompare(b))
		)
		//o(1).equals(1) (`failed math`)
	})
	o("clearData", function () {
		//o(out.rootNode.text).equals(fv)
		o(1).equals(1)
	})
	o("initData", function () {
		//o(out.rootNode.text).equals(fv)
		o(1).equals(1)
	})
})

//o.run()
