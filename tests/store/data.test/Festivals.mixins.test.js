// Festivals.mixins.test.js

import _ from "lodash"
import { describe, expect, it } from 'vitest';

import { remoteData } from "../../../src/store/data"
import validData from '../../apiData/festival.json'
import moment from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
moment.extend(isBetween)

const festData = [{
	"id": 72,
	"year": "2020",
	"language": "English",
	"organizer": null,
	"creator": 2,
	"cost": null,
	"timestamp": "2019-11-03T03:58:42.000Z",
	"deleted": 0,
	"series": 1
}]
const dateData = [
	{
		"id": 89,
		"user": 2,
		"name": "Weekend 1",
		"venue": 1,
		"basedate": moment().subtract(6, 'weeks').format(),
		"deleted": 0,
		"timestamp": "2019-11-03T14:43:34.000Z",
		"festival": 72
	},
	{
		"id": 93,
		"user": 2,
		"name": "Weekend 2",
		"venue": 1,
		"basedate": moment().subtract(5, 'weeks').format(),
		"deleted": 0,
		"timestamp": "2019-11-03T16:46:27.000Z",
		"festival": 72
	},
	{
		"id": 117,
		"user": 2,
		"name": "Weekend 1A",
		"venue": 1,
		"basedate": moment().add(6, 'weeks').format(),
		"deleted": 0,
		"timestamp": "2020-05-27T20:05:19.000Z",
		"festival": 72
	},
	{
		"id": 118,
		"user": 2,
		"name": "Weekend 2A",
		"venue": 1,
		"basedate": moment().add(7, 'weeks').format(),
		"deleted": 0,
		"timestamp": "2020-05-27T20:05:54.000Z",
		"festival": 72
	}
]


describe("store/data Festival Mixin methods", function () {
	const {
		Festivals: festivals,
		Dates: dates,
		Intentions: intentions,
		Venues: venues
	} = remoteData

	//filterable
	describe("filterable", function () {
		it('getFiltered', function () {
			festivals.clear()
			festivals.replaceList(validData)
			//console.log('list', festivals.list.map(x => x.id))
			//console.log('data', validData.map(x => x.id))
			expect(festivals.list.map(x => x.id).length).toEqual(validData.filter(x => !x.deleted).map(x => x.id).length)
			const [a, b, c, ...restFestivals] = validData
			const targetFestivals = [a, b, c].sort((a, b) => a.id - b.id)
			const targetIds = targetFestivals.map(a => a.id)
			const gotFestivals = festivals.getFiltered(a => targetIds.includes(a.id)).sort((a, b) => a.id - b.id)
			expect(targetFestivals).toEqual(gotFestivals)
		})
	})

	//subjective
	describe("subjective", function () {
		it('getSubjectObject', function () {
			festivals.clear()
			const testNum = 1234

			expect(festivals.getSubjectObject(testNum)).toEqual({ subjectType: 7, subject: testNum })

		})
	})

	//event
	//eventSub(dates)
	//eventSuper(Series)


	//messageFestivalConnections(messages, lineups)
	describe("messageFestivalConnections", function () {
		it('messageEventConnection', function () {
			expect(festivals.messageEventConnection({})({})).toEqual(false)



		})
	})
	//research(artists, messages, lineups, artistPriorities),
	//festivalActive(dates),

	describe("festivalActive", function () {
		const pastDates = dateData.map(d => Object.assign({}, d, { basedate: moment(d.basedate).subtract(1, 'years').format() }))
		const currentDates = dateData.map(d => Object.assign({}, d, { basedate: moment().subtract(6, 'hours').format() }))
		const futureDates = dateData.map(d => Object.assign({}, d, { basedate: moment(d.basedate).add(1, 'years').format() }))
		const splitDates = dateData.map((d, i, arr) => i < (arr.length / 2) ? pastDates[i] : futureDates[i])
		const splitActiveDates = dateData.map((d, i, arr) => i < (arr.length / 3) ? pastDates[i] : i > (arr.length / 3 + 1) ? futureDates[i] : currentDates[i])
		const testId = 72
		const unknownId = 400
		it('getStartMoment', function () {
			festivals.replaceList(festData)

			expect(festivals.getStartMoment(unknownId)).toEqual(undefined)
			dates.replaceList(futureDates)
			const startValue = futureDates
				.map(x => dates.getStartMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((lowest, test) => test < lowest ? test : lowest, 32503683600000)
			expect(festivals.getStartMoment(testId).valueOf()).toEqual(startValue)

			dates.replaceList(pastDates)
			const startValue2 = pastDates
				.map(x => dates.getStartMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((lowest, test) => test < lowest ? test : lowest, 32503683600000)
			expect(festivals.getStartMoment(testId).valueOf()).toEqual(startValue2)

			dates.clear()
			const startValue3 = moment(
				_.get(festData.find(f => f.id === testId), 'year', 32503683600000),
				'YYYY'
			).valueOf()
			expect(festivals.getStartMoment(testId).valueOf()).toEqual(startValue3)
		})

		it('getEndMoment', function () {
			festivals.replaceList(festData)


			expect(festivals.getEndMoment(unknownId)).toEqual(undefined)
			dates.replaceList(futureDates)
			const endValue = futureDates
				.map(x => dates.getEndMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((highest, test) => test > highest ? test : highest, 0)
			expect(festivals.getEndMoment(testId).valueOf()).toEqual(endValue)

			dates.replaceList(pastDates)
			const endValue2 = pastDates
				.map(x => dates.getEndMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((highest, test) => test > highest ? test : highest, 0)
			expect(festivals.getEndMoment(testId).valueOf()).toEqual(endValue2)

			dates.clear()
			const endValue3 = moment(
				_.get(festData.find(f => f.id === testId), 'year', 32503683600000),
				'YYYY'
			).valueOf()
			expect(festivals.getEndMoment(testId).valueOf()).toEqual(endValue3)
		})

		it('active', function () {
			dates.clear()
			festivals.replaceList(festData)


			expect(festivals.active(unknownId)).toEqual(false)


			dates.replaceList(splitActiveDates)
			//console.log('splitActiveDates', testId, splitActiveDates)
			//console.log('dateData', testId, dateData)
			//console.log('date list', dates.list)

			const s = festivals.getStartMoment(testId)
			const e = festivals.getEndMoment(testId)
			//console.log('start to end:', s.format(), e.format())
			//console.log('active:', moment().isBetween(s, e, 'day'))

			expect(festivals.active(testId)).toEqual(true)

			dates.clear()
			dates.replaceList(pastDates)
			expect(festivals.active(testId)).toEqual(false)

			dates.clear()
			dates.replaceList(futureDates)
			expect(festivals.active(testId)).toEqual(false)

			dates.clear()
			expect(festivals.active(testId)).toEqual(false)
		})


		it('activeDate', function () {
			dates.clear()
			festivals.replaceList(festData)


			expect(festivals.activeDate(unknownId)).toEqual(false)


			dates.replaceList(splitActiveDates)
			/*
			console.log('splitActiveDates', testId, splitActiveDates)

			//console.log('start to end:', s.format(), e.format())
			const activeDates = splitActiveDates.filter(d => {

				const s = moment(d.basedate).subtract(1, 'days')
				const e = moment(d.basedate).add(2, 'days')
				return moment().isBetween(s, e, 'day')
			})
			console.log('active:', activeDates)
			*/
			expect(festivals.activeDate(testId)).toEqual(true)

			dates.clear()
			dates.replaceList(pastDates)
			expect(festivals.activeDate(testId)).toEqual(false)

			dates.clear()
			dates.replaceList(futureDates)
			expect(festivals.activeDate(testId)).toEqual(false)

			dates.clear()
			expect(festivals.activeDate(testId)).toEqual(false)
		})

		it('future', function () {
			dates.clear()
			festivals.replaceList(festData)
			const daysAhead = 100



			dates.replaceList(splitActiveDates)
			expect(festivals.future().length === 1).toEqual(true)
			//console.log('splitActiveDates', testId, splitActiveDates)

			//const s = festivals.getStartMoment(testId)
			//const e = festivals.getEndMoment(testId)
			//console.log('start to end:', s.format(), e.format())
			//console.log('active:', moment().isBetween(s, e, 'day'))

			expect(festivals.future(daysAhead).length === 1).toEqual(true)

			dates.clear()
			dates.replaceList(pastDates)
			expect(festivals.future().length === 1).toEqual(false)
			expect(festivals.future(daysAhead).length === 1).toEqual(false)

			dates.clear()
			dates.replaceList(futureDates)
			expect(festivals.future().length === 1).toEqual(true)
			expect(festivals.future(daysAhead).length === 1).toEqual(true)

			dates.clear()
			expect(festivals.future().length === 1).toEqual(false)
			expect(festivals.future(daysAhead).length === 1).toEqual(false)
		})
	})
	//intended(intentions),

	describe("intended", function () {
		const bigHorizon = 400
		it('intended', function () {
			festivals.replaceList(festData)
			const pastDates = dateData.map(d => Object.assign({}, d, { basedate: moment(d.basedate).subtract(1, 'years').format() }))
			const currentDates = dateData.map(d => Object.assign({}, d, { basedate: moment().format() }))
			const futureDates = dateData.map(d => Object.assign({}, d, { basedate: moment(d.basedate).add(1, 'years').format() }))
			const splitDates = dateData.map((d, i, arr) => _.clone(i < (arr.length / 2) ? pastDates[i] : futureDates[i]))
			const splitActiveDates = dateData.map((d, i, arr) => _.clone(i < (arr.length / 3) ? pastDates[i] : i > (arr.length / 3 + 1) ? futureDates[i] : currentDates[i]))
			/*
						console.log('pastDates', pastDates)
						console.log('futureDates', futureDates)
						console.log('splitDates', splitDates)
			*/
			const intendedForTestFestival = [{
				"id": 388,
				"subject": 72,
				"subjectType": 7,
				"user": 2,
				"deleted": 0,
				"timestamp": "2020-01-06T10:13:21.000Z"
			}]
			const intendedForTestFestivalLateDate = [{
				"id": 118,
				"subject": 118,
				"subjectType": 8,
				"user": 2,
				"deleted": 0,
				"timestamp": "2020-01-06T10:13:21.000Z"
			}]
			const intendedForTestFestivalEarlyDate = [{
				"id": 89,
				"subject": 89,
				"subjectType": 8,
				"user": 2,
				"deleted": 0,
				"timestamp": "2020-01-06T10:13:21.000Z"
			}]
			const noIntentions = []

			//no returns
			dates.clear()
			dates.replaceList(futureDates)
			intentions.replaceList(noIntentions)
			expect(festivals.intended(bigHorizon, { skipDetails: true }).length).toEqual(0)

			dates.clear()
			dates.replaceList(pastDates)
			intentions.replaceList(noIntentions)
			expect(festivals.intended(bigHorizon, { skipDetails: true }).length).toEqual(0)

			dates.clear()
			dates.replaceList(splitDates)
			intentions.replaceList(intendedForTestFestivalEarlyDate)
			/*
						console.log('future festivals', intentions.list, festivals.future(bigHorizon).filter(festival => {
							const direct = intentions.getFiltered(festivals.getSubjectObject(festival.id)).length
							if(direct) return 
							const unendedDates = festivals.getSubDateIds(festival.id).filter(did => !dates.ended(did))
							console.log('unendedDates', unendedDates)
							if(!unendedDates.length) return false
							return !!intentions.getFiltered(i => console.log('checking intention', i) || i.subjectType === DATE && unendedDates.includes(i.subject)).length
						}
							
						))
			*/
			expect(festivals.intended(bigHorizon, { skipDetails: true }).length).toEqual(0)

			//returns
			dates.clear()


			dates.replaceList(splitDates)
			//console.log('list', festivals.list.map(x => x.id))
			//console.log('data', validData.map(x => x.id))
			intentions.replaceList(intendedForTestFestivalLateDate)
			/*
						console.log('future festivals', intentions.list, festivals.future(bigHorizon)
							.filter(festival => intentions.getFiltered(festivals.getSubjectObject(festival.id)).length ||
								intentions.getFiltered(i => i.subjectType === DATE && festivals.getSubDateIds(festival.id).includes(i.subject)).length
						))
			*/

			expect(festivals.intended(bigHorizon, { skipDetails: true }).length).toEqual(1)


		})
	})

	/*
		//update -> create
		describe("update", function() {
			const id = 44
			const data = []
			
			describe("update", function() {
				//
				expect("resolve", function(done) {
					const v = festivals.update(data, id, {
						remoteData: validData,
						remoteResult: 'resolve'
					})
						.then(check => {
							expect(check).toEqual(`/api/${festivals.fieldName}/update?where={"id":${id}}`) `update`
						})
						.then(done)
						.catch(err => {
							expect(err).toEqual('dead') `rejection`
							done()
						})
	
				})
	
				//
				expect("reject", function(done) {
				const j = festivals.update(data, id, {
					remoteData: validData,
					remoteResult: 'reject'
				})
					.then(check => {
						expect(check).toEqual('dead') `no update`
					})
					.then(done)
					.catch(err => {
						expect(err).notEquals(undefined) `rejection`
						done()
					})
	
				})
			})
		})
		*/
	//festivalIds(subjects),
	//getPromise,
	//festivalDetails(subjects, lineups, images, artistAliases, genres, artistGenres, parentGenres, artistPriorities, intentions)
})