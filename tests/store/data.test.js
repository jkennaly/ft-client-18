// data.test.js

import _ from "lodash"
import { describe, expect, it } from 'vitest';


console.log('hello')
import { remoteData, clearData, initData } from "../../src/store/data.js"

describe("store/data", function () {
	it("remoteData", function () {
		expect(_.keys(remoteData).sort((a, b) => a.localeCompare(b))).toEqual(
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
		//it(1).toEqual(1) (`failed math`)
	})
	it("clearData", function () {
		//it(out.rootNode.text).toEqual(fv)
		expect(1).toEqual(1)
	})
	it("initData", function () {
		//it(out.rootNode.text).toEqual(fv)
		expect(1).toEqual(1)
	})
})

//o.run()
