// data.test.js


import _ from 'lodash'
import moment from 'dayjs'
import { describe, expect, it } from 'vitest';

import { metaQuivalent, calcMeta } from '../../../src/services/localData'

import { remoteData } from "../../../src/store/data"
import validData from '../../apiData/artist.json'

describe("store/data Artist List Empty", function () {
	const artists = _.cloneDeep(remoteData.Artists)
	artists.clear()

	it("Artist list", function () {
		expect(artists.list).toEqual([])
	})
	it("Artist meta", function () {
		expect(typeof artists.meta.calcTime).toEqual('number')
		expect(artists.meta.timestamps).toEqual([Infinity, 0])
		expect(artists.meta.ids).toEqual([Infinity, 0])
		expect(_.keys(artists.meta).sort((a, b) => a.localeCompare(b))).toEqual([
			'calcTime',
			'timestamps',
			'ids'
		].sort((a, b) => a.localeCompare(b)))
		expect(typeof artists.setMeta).toEqual('function')
	})
	it("Artist setMeta", function () {
		expect(typeof artists.setMeta).toEqual('function')
		const startMeta = _.clone(artists.meta)
		expect(artists.meta).toEqual(startMeta)

		const testMeta = { a: 1, b: 2 }
		artists.setMeta(testMeta)
		expect(artists.meta).toEqual(testMeta)

		artists.setMeta(startMeta)
		expect(artists.meta).toEqual(startMeta)

	})
})


describe("store/data Artist List Manipulations", function () {
	const artists = _.cloneDeep(remoteData.Artists)
	artists.replaceList(validData)

	it("supplied Artist list invalid", function () {
		let replaceFailed = false
		artists.replaceList({})
		expect(artists.list.length).toEqual(0)
		let backfillFailed = false
		try {
			artists.backfillList({})
		}
		catch {
			backfillFailed = true
		}
		expect(backfillFailed).toEqual(true)
	})

	it("replace Artist list", function () {
		artists.clear()
		const calcdMeta = calcMeta(validData)
		const oldRemoteLoad = 0 + artists.lastRemoteLoad
		const oldRemoteCheck = 0 + artists.lastRemoteCheck
		artists.replaceList(validData)
		expect(artists.list.length).toEqual(validData.length)
		expect(metaQuivalent(artists.meta, calcdMeta)).toEqual(true)
		expect(artists.lastRemoteLoad > oldRemoteLoad).toEqual(true)
		expect(artists.lastRemoteCheck > oldRemoteCheck).toEqual(true)
	})

	it("clear Artist list", function () {
		const calcdMeta = calcMeta(validData)
		const oldRemoteLoad = 0 + artists.lastRemoteLoad
		const oldRemoteCheck = 0 + artists.lastRemoteCheck
		artists.replaceList(validData)
		expect(artists.list.length).toEqual(validData.length)


		artists.clear()
		expect(metaQuivalent(artists.meta, calcdMeta)).toEqual(false)
		expect(artists.lastRemoteLoad).toEqual(0)
		expect(artists.lastRemoteCheck).toEqual(0)
	})

	it("backfill Artist list (remoteEntry)", function () {
		artists.clear()
		const halfData = validData.filter((e, i) => i % 2)
		const quarterData = validData.filter((e, i) => i % 4 === 2)
		const threeMeta = calcMeta([...halfData, ...quarterData])
		const oldRemoteLoad = 0 + artists.lastRemoteLoad
		const oldRemoteCheck = 0 + artists.lastRemoteCheck

		artists.replaceList(halfData)
		expect(artists.list.length).toEqual(halfData.length)

		artists.backfillList(quarterData)
			.then(() => {
				expect(artists.list.length).toEqual(halfData.length + quarterData.length)
				expect(metaQuivalent(artists.meta, threeMeta)).toEqual(true)
				expect(artists.lastRemoteLoad > oldRemoteLoad).toEqual(true)
				expect(artists.lastRemoteCheck > oldRemoteCheck).toEqual(true)
			})
			.then()
			.catch()
	})

	it("backfill Artist list (localEntry)", function () {
		artists.clear()
		const halfData = validData.filter((e, i) => i % 2)
		const quarterData = validData.filter((e, i) => i % 4 === 2)
		const threeMeta = calcMeta([...halfData, ...quarterData])

		artists.replaceList(halfData)
		expect(artists.list.length).toEqual(halfData.length)

		const oldRemoteLoad = 0 + artists.lastRemoteLoad
		const oldRemoteCheck = 0 + artists.lastRemoteCheck

		artists.backfillList(quarterData, true)
			.then(() => {
				expect(artists.list.length).toEqual(halfData.length + quarterData.length)
				expect(metaQuivalent(artists.meta, threeMeta)).toEqual(true)
				expect(artists.lastRemoteLoad).toEqual(oldRemoteLoad)
				expect(artists.lastRemoteCheck).toEqual(oldRemoteCheck)
			})
			.then()
			.catch()
	})

	it("get Artist", function () {
		artists.clear()
		artists.replaceList(validData)
		expect(artists.list.length).toEqual(validData.length)
		const targetArtist = _.shuffle(validData)[0]

		const gotArtist = artists.get(targetArtist.id)
		expect(targetArtist).toEqual(gotArtist)

	})

	it("getMany Artist", function () {
		artists.clear()
		artists.replaceList(validData)
		expect(artists.list.length).toEqual(validData.length)
		const [a, b, c, ...restArtists] = _.shuffle(validData)
		const targetArtists = [a, b, c].sort((a, b) => a.id - b.id)
		const targetIds = targetArtists.map(a => a.id)
		const gotArtists = artists.getMany(targetIds).sort((a, b) => a.id - b.id)
		expect(targetArtists).toEqual(gotArtists)

	})

	it("dataCurrent Artist", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		artists.replaceList(validData)
		expect(artists.list.length).toEqual(validData.length)
		expect(artists.dataCurrent()).toEqual(true)

	})
})
describe("remoteCheck Artist", function () {
	const artists = _.cloneDeep(remoteData.Artists)
	// 16 cases: unforced/forced and data.current/not current and resolve/reject and local/remote

	//
	it("unforced current resolve resolve remoteCheck", function () {
		artists.replaceList(validData)
		expect(artists.dataCurrent()).toEqual(true)
		const ucvv = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {
				expect(check).toEqual(false)
			})
			.then()
			.catch(err => {


			})

	})
	it("unforced stale resolve resolve remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const usvv = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {

			})
			.then()
			.catch(err => {


			})

	})
	it("forced stale resolve resolve remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const fsvv = artists.remoteCheck(true, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {

			})
			.then()
			.then()
			.catch(err => {

				console.log(err)
			})

	})
	//
	it("unforced stale reject resolve remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const usjv = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.catch(err => {

				expect(true).toEqual(true)
			})

	})
	//
	it("forced stale reject resolve remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const fsjv = artists.remoteCheck(true, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("unforced current resolve reject remoteCheck", function () {
		artists.replaceList(validData)
		expect(artists.dataCurrent()).toEqual(true)
		const ucvj = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual(false)
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("forced current resolve reject remoteCheck", function () {
		expect(artists.dataCurrent()).toEqual(true)
		const fcvj = artists.remoteCheck(true, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("unforced stale resolve reject remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const usvj = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("forced stale resolve reject remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const fsvj = artists.remoteCheck(true, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("unforced current reject reject remoteCheck", function () {
		artists.replaceList(validData)
		expect(artists.dataCurrent()).toEqual(true)
		const ucjj = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual(false)
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("forced current reject reject remoteCheck", function () {
		artists.replaceList(validData)
		expect(artists.dataCurrent()).toEqual(true)
		const fcjj = artists.remoteCheck(true, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("unforced stale reject reject remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const usjj = artists.remoteCheck(false, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("forced stale reject reject remoteCheck", function () {
		artists.clear()
		expect(artists.dataCurrent()).toEqual(false)
		const fsjj = artists.remoteCheck(true, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})


})
describe("acquireListUpdate Artist", function () {
	const artists = _.cloneDeep(remoteData.Artists)
	artists.replaceList(validData)

	//
	it("resolve resolve", function () {
		const vv = artists.acquireListUpdate(undefined, undefined, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {

				expect(check).toEqual(true)

			})
			.then()
			.catch(err => {


			})

	})
	//
	it("reject resolve", function () {
		const jv = artists.acquireListUpdate(undefined, undefined, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'resolve'
		})
			.then(check => {
				expect(check).toEqual('dead')
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("resolve reject", function () {
		const vj = artists.acquireListUpdate(undefined, undefined, {
			remoteData: validData,
			remoteResult: 'resolve',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual(false)
			})
			.then()
			.catch(err => {


			})

	})
	//
	it("reject reject", function () {
		const jj = artists.acquireListUpdate(undefined, undefined, {
			remoteData: validData,
			remoteResult: 'reject',
			localData: [],
			localResult: 'reject'
		})
			.then(check => {
				expect(check).toEqual(false)
			})
			.then()
			.catch(err => {


			})

	})


})
/*

		append: data => appendData(remoteData.Artists)(data),
		clear: () => {
			remoteData.Artists.meta = defaultMeta()
			remoteData.Artists.list = []
			remoteData.Artists.lastRemoteLoad = 0
		},
		reload: () => remoteData.Artists.lastRemoteLoad = ts() - remoteData.Artists.remoteInterval + 1,
		get: id => _.find(remoteData.Artists.list, p => p.id === id),
		getMany: ids => remoteData.Artists.list.filter(d => ids.indexOf(d.id) > -1),
		getName: id => {
			//console.log('remoteData.Artists.getName ' + id)
			const data = remoteData.Artists.get(id)
			if(!data) return
			return data.name

		},
		getRating: (id, userId) => {
			const ratings = remoteData.Messages.forArtist(id)
				.filter(m => m.messageType === 2)
				.filter(m => !userId || m.fromuser === userId)
				.sort(timeStampSort)
			const ratingContent = ratings.length ? ratings[0].content : '0'
			const intValue = parseInt(ratingContent, 10)
			//console.log('data.js remoteData.Artists.getRating ratings.length ' + ratings.length )
			//console.log('data.js remoteData.Artists.getRating intValue ' + intValue )
			return intValue
		},
		virgins: () => {
			const futures = remoteData.Festivals.future()

			return remoteData.Artists.list
				.filter(a => remoteData.Lineups.artistInLineup(a.id))
				.filter(ar => remoteData.Messages.virginSubject({subjectType: 2, subject: ar.id}))
				.sort((a, b) => {
					//primary: in a lineup for a festival in the future
					const aFuture = _.some(futures, f => remoteData.Lineups.artistInFestival(a.id, f.id))
					const bFuture = _.some(futures, f => remoteData.Lineups.artistInFestival(b.id, f.id))
					const usePrimary = aFuture ? !bFuture : bFuture
					if(usePrimary && aFuture) return -1
					if(usePrimary && bFuture) return 1
					//secondary: peak priority level
					const al = remoteData.Lineups.peakArtistPriLevel(a.id)
					const bl = remoteData.Lineups.peakArtistPriLevel(b.id)
					return al -bl
				})
		},
		//no comment
		//no rating
		//no set with a rating
		//no set with a comment
		idFields: () => remoteData.Artists.list.length ?
			Object.keys(remoteData.Artists.list[0]).filter(idFieldFilter) :
			[],
		forFestival: festivalId => {
			const artistIds = remoteData.Lineups.getFestivalArtistIds(festivalId)
			return remoteData.Artists.getMany(artistIds)
		},
		getSubjectObject: id => {return {subjectType: 2, subject: id}},

		//a message about an artist is connected to an event if:
		//the event is associated with a festival that has the artist in a lineup
		messageEventConnection: e => m => {
			const mValid = m.subjectType === 2
			const artistFestivals = remoteData.Lineups.festivalsForArtist(m.subject)
				.map(id => remoteData.Festivals.getSubjectObject(id))
			const retVal = mValid && _.find(
				artistFestivals,
				f => remoteData.Festivals.messageEventConnection(e)(f)
			)
			//console.log('remoteData.Artists.messageEventConnection')
			//console.log('mValid')
			//console.log(mValid)
			//console.log('artistFestivals')
			//console.log(artistFestivals)
			//console.log('retVal')
			//console.log(retVal)

			return retVal
		},
		patternMatch: (pattern, count = 5) => {
			return _.take(smartSearch(remoteData.Artists.list,
					[pattern], {name: true}
					), count)
					.map(x => x.entry)
		},
		loadList: (forceRemoteLoad, options) => updateList(remoteData.Artists, 'remoteData.Artists', forceRemoteLoad, options),
		remoteLoad: (options) => loadRemote(remoteData.Artists, 'remoteData.Artists', undefined, options),
		update: (data, id) => {
			const end = 'Artists/update?where={"id":' + id + '}'
			//console.log('update artists')
			//console.log(data)
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(remoteData.Artists.remoteLoad)
				.catch(logResult)
		},
		merge: (id1, id2) => {
			const end = 'Artists/admin/merge/' + id1 + '/' + id2
			//console.log('update artists')
			//console.log(data)
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)()))
				.then(remoteData.Artists.remoteLoad)
				.catch(logResult)

		}
*/
//o.run()

