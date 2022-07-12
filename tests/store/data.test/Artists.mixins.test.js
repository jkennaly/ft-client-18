// Artists.mixins.test.js

import { describe, expect, it } from 'vitest';
import _ from 'lodash'
import { remoteData } from "../../../src/store/data"
import validData from '../../apiData/artist.json'
import coreData from '../../apiData/core.json'
import artistRating from '../../apiData/artistRating.json'
import { timeStampSort } from '../../../src/services/sorts.js'

describe("store/data Artist Mixin methods", function () {
	const artists = remoteData.Artists
	const messages = remoteData.Messages
	const festivals = remoteData.festivals
	const lineups = remoteData.Lineups
	const series = remoteData.Series
	artists.replaceList(validData)

	//filterable
	describe("filterable", function () {
		it('getFiltered' + `replace list length match`, function () {
			artists.clear()
			artists.replaceList(validData)
			expect(artists.list.length).toEqual(validData.length)
			const [a, b, c, ...restArtists] = validData
			const targetArtists = [a, b, c].sort((a, b) => a.id - b.id)
			const targetIds = targetArtists.map(a => a.id)
			const gotArtists = artists.getFiltered(a => targetIds.includes(a.id)).sort((a, b) => a.id - b.id)
			expect(targetArtists).toEqual(gotArtists)
		})
	})

	//appendable
	describe("appendable", function () {
		it('append', function () {
			const [a, ...restArtists] = validData
			artists.clear()
			artists.replaceList(restArtists)
			const targetArtists = validData.sort((a, b) => a.id - b.id)
			artists.append(a)
				.then(() => {
					const gotArtists = artists.getFiltered(a => true).sort((a, b) => a.id - b.id)
					expect(targetArtists).toEqual(gotArtists)

				})

				.catch()
		})
	})

	//named
	describe("named", function () {
		it('getName' + `getName data objects`, function () {
			artists.clear()
			const [a, ...restArtists] = validData
			artists.append(a)
				.then(() => {
					const name = artists.getName(a.id)
					expect(name).toEqual(a.name)

				})

				.catch()
		})
	})


	//rated
	describe("rated", function () {
		it('getRating', function () {
			messages.replaceList(artistRating)
			const [a, ...restRatings] = artistRating
			const allArtistRatings = artistRating
				.filter(r => r.subject === a.subject)
				.sort(timeStampSort)

			const userRate = {
				rating: parseInt(allArtistRatings[0].content, 10),
				userId: allArtistRatings[0].fromuser
			}
			const averageRate = Math.floor(
				allArtistRatings
					.map(r => r.content)
					.map(c => parseInt(c, 10))
					.reduce((pv, cv, i, ar) => pv + cv / ar.length, 0)
			)

			expect(artists.getRating(a.subject)).toEqual(averageRate)
			expect(artists.getRating(a.subject, userRate.userId)).toEqual(userRate.rating)
		})
	})

	//virginal
	describe("virginal", function () {
		it('virgins', function () {
			messages.replaceList(artistRating)
			artists.replaceList(validData)
			const virgins = artists.list.filter(ar => !messages.getFiltered({ subjectType: 2, subject: ar.id }).length)
				.sort((a, b) => a.id - b.id)
			const foundVirgins = artists.virgins()
				.sort((a, b) => a.id - b.id)
			expect(virgins).toEqual(foundVirgins)

		})
	})
	//subjective
	describe("subjective", function () {
		it('getSubjectObject', function () {
			artists.clear()
			const testNum = 1234

			expect(artists.getSubjectObject(testNum)).toEqual({ subjectType: 2, subject: testNum })

		})
	})
	//nameMatch
	describe("nameMatch", function () {
		it('patternMatch', function () {
			artists.replaceList(validData)
			//get a fragment of a name
			const targetMatch = validData.find(d => d.name && d.name.length > 3)
			const fullName = targetMatch.name
			const fragLength = Math.floor(fullName.length / 2)
			const fragStart = Math.floor(fragLength / 2)
			const fragEnd = fragStart + fragLength
			const frag = fullName.substring(fragStart, fragEnd)

			const matches = artists.patternMatch(frag, validData.length)
			const matchedIds = matches.map(x => x.id)
			expect(matchedIds.includes(targetMatch.id)).toEqual(true)


		})
	})
	//messageArtistConnections
	describe("messageArtistConnections", function () {
		it('messageEventConnection', function () {
			expect(artists.messageEventConnection({})({})).toEqual(false)



		})
	})
	//merge
	describe("merge", function () {
		const id1 = 44
		const id2 = 23

		describe("merge", function () {
			//
			it("resolve", function () {
				const v = artists.merge(id1, id2, {
					remoteData: validData,
					remoteResult: 'resolve'
				})
					.then(check => {
						expect(check).toEqual(`/api/${artists.fieldName}/admin/merge/${id1}/${id2}`)
					})
					.catch(err => {
						expect(err).toEqual('dead')

					})

			})

			//
			it("reject", function () {
				const j = artists.merge(id1, id2, {
					remoteData: validData,
					remoteResult: 'reject'
				})
					.then(check => {
						expect(check).toEqual('dead')
					})

					.catch(err => {
						expect(err).not.toEqual(undefined)

					})

			})
		})
	})
	//update
	describe("update", function () {
		const id = 44
		const data = []

		describe("update", function () {
			//
			it("resolve", function () {
				const v = artists.update(data, id, {
					remoteData: validData,
					remoteResult: 'resolve'
				})
					.then(check => {
						expect(check).toEqual(`/api/${artists.fieldName}/update?where={"id":${id}}`)
					})
					.catch(err => {
						expect(err).toEqual('dead')

					})

			})

			//
			it("reject", function () {
				const j = artists.update(data, id, {
					remoteData: validData,
					remoteResult: 'reject'
				})
					.then(check => {
						expect(check).toEqual('dead')
					})

					.catch(err => {
						expect(err).not.toEqual(undefined)

					})

			})
		})
	})
})