// Artists.mixins.test.js

import o from "ospec"
import _ from 'lodash'
import { remoteData } from "../../../src/store/data"
import validData from '../../apiData/artist.json'
import coreData from '../../apiData/core.json'
import artistRating from '../../apiData/artistRating.json'
import { timeStampSort } from '../../../src/services/sorts.js'

o.spec("store/data Artist Mixin methods", function () {
	const artists = remoteData.Artists
	const messages = remoteData.Messages
	const festivals = remoteData.festivals
	const lineups = remoteData.Lineups
	const series = remoteData.Series
	artists.replaceList(validData)

	//filterable
	o.spec("filterable", function () {
		o('getFiltered', function () {
			artists.clear()
			artists.replaceList(validData)
			o(artists.list.length).equals(validData.length)`replace list length match`
			const [a, b, c, ...restArtists] = validData
			const targetArtists = [a, b, c].sort((a, b) => a.id - b.id)
			const targetIds = targetArtists.map(a => a.id)
			const gotArtists = artists.getFiltered(a => targetIds.includes(a.id)).sort((a, b) => a.id - b.id)
			o(targetArtists).deepEquals(gotArtists)`getMany data objects`
		})
	})

	//appendable
	o.spec("appendable", function () {
		o('append', function (done) {
			const [a, ...restArtists] = validData
			artists.clear()
			artists.replaceList(restArtists)
			const targetArtists = validData.sort((a, b) => a.id - b.id)
			artists.append(a)
				.then(() => {
					const gotArtists = artists.getFiltered(a => true).sort((a, b) => a.id - b.id)
					o(targetArtists).deepEquals(gotArtists)`getMany data objects`

				})
				.then(done)
				.catch(done)
		})
	})

	//named
	o.spec("named", function () {
		o('getName', function (done) {
			artists.clear()
			const [a, ...restArtists] = validData
			artists.append(a)
				.then(() => {
					const name = artists.getName(a.id)
					o(name).deepEquals(a.name)`getName data objects`

				})
				.then(done)
				.catch(done)
		})
	})


	//rated
	o.spec("rated", function () {
		o('getRating', function () {
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

			o(artists.getRating(a.subject)).equals(averageRate)`getRating averageRate`
			o(artists.getRating(a.subject, userRate.userId)).equals(userRate.rating)`getRating userRate`
		})
	})

	//virginal
	o.spec("virginal", function () {
		o('virgins', function () {
			messages.replaceList(artistRating)
			artists.replaceList(validData)
			const virgins = artists.list.filter(ar => !messages.getFiltered({ subjectType: 2, subject: ar.id }).length)
				.sort((a, b) => a.id - b.id)
			const foundVirgins = artists.virgins()
				.sort((a, b) => a.id - b.id)
			o(virgins).deepEquals(foundVirgins)`getRating foundVirgins`

		})
	})
	//subjective
	o.spec("subjective", function () {
		o('getSubjectObject', function () {
			artists.clear()
			const testNum = 1234

			o(artists.getSubjectObject(testNum)).deepEquals({ subjectType: 2, subject: testNum })`subjectObject ok`

		})
	})
	//nameMatch
	o.spec("nameMatch", function () {
		o('patternMatch', function () {
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
			o(matchedIds.includes(targetMatch.id)).equals(true)`patternMatch ok`


		})
	})
	//messageArtistConnections
	o.spec("messageArtistConnections", function () {
		o('messageEventConnection', function () {
			o(artists.messageEventConnection({})({})).equals(false)



		})
	})
	//merge
	o.spec("merge", function () {
		const id1 = 44
		const id2 = 23

		o.spec("merge", function () {
			//
			o("resolve", function (done) {
				const v = artists.merge(id1, id2, {
					remoteData: validData,
					remoteResult: 'resolve'
				})
					.then(check => {
						o(check).equals(`/api/${artists.fieldName}/admin/merge/${id1}/${id2}`)`update`
					})
					.then(done)
					.catch(err => {
						o(err).equals('dead')`rejection`
						done()
					})

			})

			//
			o("reject", function (done) {
				const j = artists.merge(id1, id2, {
					remoteData: validData,
					remoteResult: 'reject'
				})
					.then(check => {
						o(check).equals('dead')`no update`
					})
					.then(done)
					.catch(err => {
						o(err).notEquals(undefined)`rejection`
						done()
					})

			})
		})
	})
	//update
	o.spec("update", function () {
		const id = 44
		const data = []

		o.spec("update", function () {
			//
			o("resolve", function (done) {
				const v = artists.update(data, id, {
					remoteData: validData,
					remoteResult: 'resolve'
				})
					.then(check => {
						o(check).equals(`/api/${artists.fieldName}/update?where={"id":${id}}`)`update`
					})
					.then(done)
					.catch(err => {
						o(err).equals('dead')`rejection`
						done()
					})

			})

			//
			o("reject", function (done) {
				const j = artists.update(data, id, {
					remoteData: validData,
					remoteResult: 'reject'
				})
					.then(check => {
						o(check).equals('dead')`no update`
					})
					.then(done)
					.catch(err => {
						o(err).notEquals(undefined)`rejection`
						done()
					})

			})
		})
	})
})