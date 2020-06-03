// data.test.js

     
import _ from 'lodash'
import moment from 'moment'
var o = require("ospec")

import {metaQuivalent, calcMeta} from '../../../src/services/localData'

import {remoteData} from "../../../src/store/data"
import validData from '../../apiData/artist.json'

o.spec("store/data Artist List Empty", function() {
	const artists = _.cloneDeep(remoteData.Artists)
	artists.clear()

    o("Artist list", function() {
        o(artists.list).deepEquals([])
	})
    o("Artist meta", function() {
        o(typeof artists.meta.calcTime).equals('number')
        o(artists.meta.timestamps).deepEquals([Infinity, 0])
        o(artists.meta.ids).deepEquals([Infinity, 0])
        o(_.keys(artists.meta).sort((a, b) => a.localeCompare(b))).deepEquals([
		    'calcTime',
		    'timestamps',
		    'ids'
    	].sort((a, b) => a.localeCompare(b)))
        o(typeof artists.setMeta).equals('function')
	})
    o("Artist setMeta", function() {
        o(typeof artists.setMeta).equals('function')
        const startMeta = _.clone(artists.meta)
        o(artists.meta).deepEquals(startMeta)

        const testMeta = {a: 1, b: 2}
        artists.setMeta(testMeta)
        o(artists.meta).deepEquals(testMeta)

        artists.setMeta(startMeta)
        o(artists.meta).deepEquals(startMeta)

	})
})


o.spec("store/data Artist List Manipulations", function() {
	const artists = _.cloneDeep(remoteData.Artists)
    artists.replaceList(validData)

    o("supplied Artist list invalid", function() {
    	let replaceFailed = false
    	artists.replaceList({})
        o(artists.list.length).equals(0)
    	let backfillFailed = false
    	try {
    		artists.backfillList({})
    	}
    	catch {
    		backfillFailed = true
    	}
        o(backfillFailed).equals(true)
	})

    o("replace Artist list", function() {
        artists.clear()
    	const calcdMeta = calcMeta(validData)
    	const oldRemoteLoad = 0 + artists.lastRemoteLoad
    	const oldRemoteCheck = 0 + artists.lastRemoteCheck
    	artists.replaceList(validData)
        o(artists.list.length).equals(validData.length) `replace list length match`
        o(metaQuivalent(artists.meta, calcdMeta)).equals(true) `meta match`
        o(artists.lastRemoteLoad > oldRemoteLoad).equals(true) `remote load updated`
        o(artists.lastRemoteCheck > oldRemoteCheck).equals(true) `remote check updated`
	})

    o("clear Artist list", function() {
    	const calcdMeta = calcMeta(validData)
    	const oldRemoteLoad = 0 + artists.lastRemoteLoad
    	const oldRemoteCheck = 0 + artists.lastRemoteCheck
    	artists.replaceList(validData)
        o(artists.list.length).equals(validData.length) `replace list length match`
        

        artists.clear()
        o(metaQuivalent(artists.meta, calcdMeta)).equals(false) `meta change`
        o(artists.lastRemoteLoad).equals(0) `remote load reset`
        o(artists.lastRemoteCheck).equals(0) `remote check reset`
	})

    o("backfill Artist list (remoteEntry)", function() {
    	artists.clear()
    	const halfData = validData.filter((e, i) => i % 2)
    	const quarterData = validData.filter((e, i) => i % 4 === 2)
    	const threeMeta = calcMeta([...halfData, ...quarterData])
    	const oldRemoteLoad = 0 + artists.lastRemoteLoad
    	const oldRemoteCheck = 0 + artists.lastRemoteCheck
    	
    	artists.replaceList(halfData)
        o(artists.list.length).equals(halfData.length) `replace list length match`
        
    	artists.backfillList(quarterData)
        o(artists.list.length).equals(halfData.length + quarterData.length) `backfill list length match`
        o(metaQuivalent(artists.meta, threeMeta)).equals(true) `meta match`
        o(artists.lastRemoteLoad > oldRemoteLoad).equals(true) `remote load updated`
        o(artists.lastRemoteCheck > oldRemoteCheck).equals(true) `remote check updated`
	})

    o("backfill Artist list (localEntry)", function() {
    	artists.clear()
    	const halfData = validData.filter((e, i) => i % 2)
    	const quarterData = validData.filter((e, i) => i % 4 === 2)
    	const threeMeta = calcMeta([...halfData, ...quarterData])
    	
    	artists.replaceList(halfData)
        o(artists.list.length).equals(halfData.length) `replace list length match`
        
    	const oldRemoteLoad = 0 + artists.lastRemoteLoad
    	const oldRemoteCheck = 0 + artists.lastRemoteCheck

    	artists.backfillList(quarterData, true)
        o(artists.list.length).equals(halfData.length + quarterData.length) `backfill list length match`
        o(metaQuivalent(artists.meta, threeMeta)).equals(true) `meta match`
        o(artists.lastRemoteLoad).equals(oldRemoteLoad) `remote load updated`
        o(artists.lastRemoteCheck).equals(oldRemoteCheck) `remote check updated`
	})

    o("get Artist", function() {
    	artists.clear()
    	artists.replaceList(validData)
        o(artists.list.length).equals(validData.length) `replace list length match`
        const targetArtist = _.shuffle(validData)[0]

        const gotArtist = artists.get(targetArtist.id)
        o(targetArtist).deepEquals(gotArtist) `get data object`
        
	})

    o("getMany Artist", function() {
    	artists.clear()
    	artists.replaceList(validData)
        o(artists.list.length).equals(validData.length) `replace list length match`
        const [ a, b, c, ...restArtists ] = _.shuffle(validData)
        const targetArtists = [a, b, c].sort((a, b) => a.id -b.id)
        const targetIds = targetArtists.map(a => a.id)
        const gotArtists = artists.getMany(targetIds).sort((a, b) => a.id -b.id)
        o(targetArtists).deepEquals(gotArtists) `getMany data objects`
        
	})

    o("dataCurrent Artist", function() {
    	artists.clear()
        o(artists.dataCurrent()).equals(false) `verify data needs update`
    	artists.replaceList(validData)
        o(artists.list.length).equals(validData.length) `replace list length match`
        o(artists.dataCurrent()).equals(true) `verify data current`
    	
	})
})
o.spec("remoteCheck Artist", function() {
	const artists = _.cloneDeep(remoteData.Artists)
	// 16 cases: unforced/forced and data.current/not current and resolve/reject and local/remote

    //
    o("unforced current resolve resolve remoteCheck", function(done) {
    	artists.replaceList(validData)
        o(artists.dataCurrent()).equals(true) `verify no update`
        const ucvv = artists.remoteCheck(false, {
        	remoteData: validData,
        	remoteResult: 'resolve',
        	localData: [],
        	localResult: 'resolve'
        })
        	.then(check => {
        		o(check).equals(false) `no update`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).equals('a') `rejection`
        		done()
        	})

    })
    o("unforced stale resolve resolve remoteCheck", function(done) {
    	artists.clear()
        o(artists.dataCurrent()).equals(false) `verify data needs update`
        const usvv = artists.remoteCheck(false, {
        	remoteData: validData,
        	remoteResult: 'resolve',
        	localData: [],
        	localResult: 'resolve'
        })
        	.then(check => {
        		o(check).equals(true) `updated`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).equals('dead') `rejection`
        		done()
        	})

    })
    //
    o("forced current resolve resolve remoteCheck", function(done) {
    o(artists.dataCurrent()).equals(true) `verify no update`
    const fsvv = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'resolve',
    	localData: [],
    	localResult: 'resolve'
    })
        	.then(check => {
        		o(check).equals(true) `updated`
        	})
        	.then(done)

    })
    //
    o("forced stale resolve resolve remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const fsvv = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'resolve',
    	localData: [],
    	localResult: 'resolve'
    })
        	.then(check => {
        		o(check).equals(true) `updated`
        	})
        	.then(done)

    })
    //
    o("unforced current reject resolve remoteCheck", function(done) {
    o(artists.dataCurrent()).equals(true) `verify no update`
    const ucjv = artists.remoteCheck(false, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'resolve'
    })
    	.then(check => {
    		o(check).equals(false) `no update`
    	})
    	.then(done)

    })
    //
    o("forced current reject resolve remoteCheck", function(done) {
    o(artists.dataCurrent()).equals(true) `verify no update`
    const fcjv = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'resolve'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("unforced stale reject resolve remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const usjv = artists.remoteCheck(false, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'resolve'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("forced stale reject resolve remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const fsjv = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'resolve'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("unforced current resolve reject remoteCheck", function(done) {
    	artists.replaceList(validData)
        o(artists.dataCurrent()).equals(true) `verify no update`
        const ucvj = artists.remoteCheck(false, {
        	remoteData: validData,
        	remoteResult: 'resolve',
        	localData: [],
        	localResult: 'reject'
        })
        	.then(check => {
        		o(check).equals(false) `no update`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).notEquals('dead') `rejection`
        		done()
        	})

    })
    //
    o("forced current resolve reject remoteCheck", function(done) {
    o(artists.dataCurrent()).equals(true) `verify no update`
    const fcvj = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'resolve',
    	localData: [],
    	localResult: 'reject'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("unforced stale resolve reject remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const usvj = artists.remoteCheck(false, {
    	remoteData: validData,
    	remoteResult: 'resolve',
    	localData: [],
    	localResult: 'reject'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("forced stale resolve reject remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const fsvj = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'resolve',
    	localData: [],
    	localResult: 'reject'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("unforced current reject reject remoteCheck", function(done) {
    	artists.replaceList(validData)
        o(artists.dataCurrent()).equals(true) `verify no update`
        const ucjj = artists.remoteCheck(false, {
        	remoteData: validData,
        	remoteResult: 'reject',
        	localData: [],
        	localResult: 'reject'
        })
        	.then(check => {
        		o(check).equals(false) `no update`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).notEquals('dead') `rejection`
        		done()
        	})

    })
    //
    o("forced current reject reject remoteCheck", function(done) {
    artists.replaceList(validData)
    o(artists.dataCurrent()).equals(true) `verify no update`
    const fcjj = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'reject'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("unforced stale reject reject remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const usjj = artists.remoteCheck(false, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'reject'
    })
        	.then(check => {
        		o(check).equals('dead') `no update`
        	})
        	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("forced stale reject reject remoteCheck", function(done) {
	artists.clear()
    o(artists.dataCurrent()).equals(false) `verify data needs update`
    const fsjj = artists.remoteCheck(true, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'reject'
    })
    	.then(check => {
    		o(check).equals('dead') `no update`
    	})
    	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    
	
})
o.spec("acquireListUpdate Artist", function() {
	const artists = _.cloneDeep(remoteData.Artists)
    artists.replaceList(validData)
	
    //
    o("resolve resolve", function(done) {
        const vv = artists.acquireListUpdate(undefined, undefined, {
        	remoteData: validData,
        	remoteResult: 'resolve',
        	localData: [],
        	localResult: 'resolve'
        })
        	.then(check => {
        		o(check).equals(true) `update simData`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).equals('dead') `rejection`
        		done()
        	})

    })
    //
    o("reject resolve", function(done) {
    const jv = artists.acquireListUpdate(undefined, undefined, {
    	remoteData: validData,
    	remoteResult: 'reject',
    	localData: [],
    	localResult: 'resolve'
    })
    	.then(check => {
    		o(check).equals('dead') `no update`
    	})
    	.then(done)
    	.catch(err => {
    		o(err).notEquals(undefined) `rejection`
    		done()
    	})

    })
    //
    o("resolve reject", function(done) {
        const vj = artists.acquireListUpdate(undefined, undefined, {
        	remoteData: validData,
        	remoteResult: 'resolve',
        	localData: [],
        	localResult: 'reject'
        })
        	.then(check => {
        		o(check).equals(false) `no update`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).notEquals('dead') `rejection`
        		done()
        	})

    })
    //
    o("reject reject", function(done) {
        const jj = artists.acquireListUpdate(undefined, undefined, {
        	remoteData: validData,
        	remoteResult: 'reject',
        	localData: [],
        	localResult: 'reject'
        })
        	.then(check => {
        		o(check).equals(false) `no update`
        	})
        	.then(done)
        	.catch(err => {
        		o(err).notEquals('dead') `rejection`
        		done()
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

