// sorts.test.js

import _ from "lodash"
import { describe, expect, it } from 'vitest';
import { soonestStart } from "../../src/services/sorts.js"

const sets = [
	{
		"id": 17,
		"band": 16,
		"day": 2,
		"stage": 11,
		"start": 4,
		"end": 0,
		"user": 2,
		"timestamp": "2018-09-26T11:07:55.000Z"
	},
	{
		"id": 18,
		"band": 17,
		"day": 2,
		"stage": 11,
		"start": 2,
		"end": 3,
		"user": 2,
		"timestamp": "2018-09-26T11:07:55.000Z"
	},
	{
		"id": 19,
		"band": 18,
		"day": 3,
		"stage": 10,
		"start": 0,
		"end": 2,
		"user": 2,
		"timestamp": "2018-09-26T11:07:55.000Z"
	},
	{
		"id": 21,
		"band": 20,
		"day": 2,
		"stage": 9,
		"start": 1,
		"end": 0,
		"user": 2,
		"timestamp": "2018-09-26T11:07:55.000Z"
	}
]

describe("services/sorts", function () {
	it("soonestStart", function () {
		const sorted = sets.sort(soonestStart)
		const expected = [
			{
				"id": 19,
				"band": 18,
				"day": 3,
				"stage": 10,
				"start": 0,
				"end": 2,
				"user": 2,
				"timestamp": "2018-09-26T11:07:55.000Z"
			},
			{
				"id": 21,
				"band": 20,
				"day": 2,
				"stage": 9,
				"start": 1,
				"end": 0,
				"user": 2,
				"timestamp": "2018-09-26T11:07:55.000Z"
			},
			{
				"id": 18,
				"band": 17,
				"day": 2,
				"stage": 11,
				"start": 2,
				"end": 3,
				"user": 2,
				"timestamp": "2018-09-26T11:07:55.000Z"
			},
			{
				"id": 17,
				"band": 16,
				"day": 2,
				"stage": 11,
				"start": 4,
				"end": 0,
				"user": 2,
				"timestamp": "2018-09-26T11:07:55.000Z"
			}
		]
		expect(sorted).toEqual(expected)

	})

})
