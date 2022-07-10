// Festivals.mixins.test.js

import o from "ospec"
import _ from 'lodash'
import { remoteData } from "../../../src/store/data"
import validData from '../../apiData/festival.json'
import venueData from '../../apiData/venue.json'
import coreData from '../../apiData/core.json'
import { timeStampSort } from '../../../src/services/sorts.js'
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


o.spec("store/data Festival Mixin methods", function () {
	const {
		Festivals: festivals,
		Dates: dates,
		Intentions: intentions,
		Venues: venues
	} = remoteData

	//filterable
	o.spec("filterable", function () {
		o('getFiltered', function () {
			festivals.clear()
			festivals.replaceList(validData)
			//console.log('list', festivals.list.map(x => x.id))
			//console.log('data', validData.map(x => x.id))
			o(festivals.list.map(x => x.id).length).equals(validData.filter(x => !x.deleted).map(x => x.id).length)`replace list length match`
			const [a, b, c, ...restFestivals] = validData
			const targetFestivals = [a, b, c].sort((a, b) => a.id - b.id)
			const targetIds = targetFestivals.map(a => a.id)
			const gotFestivals = festivals.getFiltered(a => targetIds.includes(a.id)).sort((a, b) => a.id - b.id)
			o(targetFestivals).deepEquals(gotFestivals)`getMany data objects`
		})
	})

	//subjective
	o.spec("subjective", function () {
		o('getSubjectObject', function () {
			festivals.clear()
			const testNum = 1234

			o(festivals.getSubjectObject(testNum)).deepEquals({ subjectType: 7, subject: testNum })`subjectObject ok`

		})
	})

	//event
	//eventSub(dates)
	//eventSuper(Series)


	//messageFestivalConnections(messages, lineups)
	o.spec("messageFestivalConnections", function () {
		o('messageEventConnection', function () {
			o(festivals.messageEventConnection({})({})).equals(false)



		})
	})
	//research(artists, messages, lineups, artistPriorities),
	//festivalActive(dates),

	o.spec("festivalActive", function () {
		const pastDates = dateData.map(d => Object.assign({}, d, { basedate: moment(d.basedate).subtract(1, 'years').format() }))
		const currentDates = dateData.map(d => Object.assign({}, d, { basedate: moment().subtract(6, 'hours').format() }))
		const futureDates = dateData.map(d => Object.assign({}, d, { basedate: moment(d.basedate).add(1, 'years').format() }))
		const splitDates = dateData.map((d, i, arr) => i < (arr.length / 2) ? pastDates[i] : futureDates[i])
		const splitActiveDates = dateData.map((d, i, arr) => i < (arr.length / 3) ? pastDates[i] : i > (arr.length / 3 + 1) ? futureDates[i] : currentDates[i])
		const testId = 72
		const unknownId = 400
		o('getStartMoment', function () {
			festivals.replaceList(festData)

			o(festivals.getStartMoment(unknownId)).equals(undefined)`find start of missing festival`
			dates.replaceList(futureDates)
			const startValue = futureDates
				.map(x => dates.getStartMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((lowest, test) => test < lowest ? test : lowest, 32503683600000)
			o(festivals.getStartMoment(testId).valueOf()).equals(startValue)`find start of soon to start festival`

			dates.replaceList(pastDates)
			const startValue2 = pastDates
				.map(x => dates.getStartMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((lowest, test) => test < lowest ? test : lowest, 32503683600000)
			o(festivals.getStartMoment(testId).valueOf()).equals(startValue2)`find start of ended festival`

			dates.clear()
			const startValue3 = moment(
				_.get(festData.find(f => f.id === testId), 'year', 32503683600000),
				'YYYY'
			).valueOf()
			o(festivals.getStartMoment(testId).valueOf()).equals(startValue3)`no dates`
		})

		o('getEndMoment', function () {
			festivals.replaceList(festData)


			o(festivals.getEndMoment(unknownId)).equals(undefined)`find end of missing festival`
			dates.replaceList(futureDates)
			const endValue = futureDates
				.map(x => dates.getEndMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((highest, test) => test > highest ? test : highest, 0)
			o(festivals.getEndMoment(testId).valueOf()).equals(endValue)`find end of soon to end festival`

			dates.replaceList(pastDates)
			const endValue2 = pastDates
				.map(x => dates.getEndMoment(x.id))
				.map(m => m.valueOf())
				.filter(_.isNumber)
				.reduce((highest, test) => test > highest ? test : highest, 0)
			o(festivals.getEndMoment(testId).valueOf()).equals(endValue2)`find end of ended festival`

			dates.clear()
			const endValue3 = moment(
				_.get(festData.find(f => f.id === testId), 'year', 32503683600000),
				'YYYY'
			).valueOf()
			o(festivals.getEndMoment(testId).valueOf()).equals(endValue3)`no dates`
		})

		o('active', function () {
			dates.clear()
			festivals.replaceList(festData)


			o(festivals.active(unknownId)).equals(false)`find status of missing festival`


			dates.replaceList(splitActiveDates)
			//console.log('splitActiveDates', testId, splitActiveDates)
			//console.log('dateData', testId, dateData)
			//console.log('date list', dates.list)

			const s = festivals.getStartMoment(testId)
			const e = festivals.getEndMoment(testId)
			//console.log('start to end:', s.format(), e.format())
			//console.log('active:', moment().isBetween(s, e, 'day'))

			o(festivals.active(testId)).equals(true)`find status of active festival`

			dates.clear()
			dates.replaceList(pastDates)
			o(festivals.active(testId)).equals(false)`find status of ended festival`

			dates.clear()
			dates.replaceList(futureDates)
			o(festivals.active(testId)).equals(false)`find status of future festival`

			dates.clear()
			o(festivals.active(testId)).equals(false)`no dates`
		})


		o('activeDate', function () {
			dates.clear()
			festivals.replaceList(festData)


			o(festivals.activeDate(unknownId)).equals(false)`find status of missing festival`


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
			o(festivals.activeDate(testId)).equals(true)`find status of activeDate festival`

			dates.clear()
			dates.replaceList(pastDates)
			o(festivals.activeDate(testId)).equals(false)`find status of ended festival`

			dates.clear()
			dates.replaceList(futureDates)
			o(festivals.activeDate(testId)).equals(false)`find status of future festival`

			dates.clear()
			o(festivals.activeDate(testId)).equals(false)`no dates`
		})

		o('future', function () {
			dates.clear()
			festivals.replaceList(festData)
			const daysAhead = 100



			dates.replaceList(splitActiveDates)
			o(festivals.future().length === 1).equals(true)`find status of missing festival`
			//console.log('splitActiveDates', testId, splitActiveDates)

			//const s = festivals.getStartMoment(testId)
			//const e = festivals.getEndMoment(testId)
			//console.log('start to end:', s.format(), e.format())
			//console.log('active:', moment().isBetween(s, e, 'day'))

			o(festivals.future(daysAhead).length === 1).equals(true)`find status of future festival`

			dates.clear()
			dates.replaceList(pastDates)
			o(festivals.future().length === 1).equals(false)`find status of missing festival`
			o(festivals.future(daysAhead).length === 1).equals(false)`find status of ended festival`

			dates.clear()
			dates.replaceList(futureDates)
			o(festivals.future().length === 1).equals(true)`find status of missing festival`
			o(festivals.future(daysAhead).length === 1).equals(true)`find status of future festival`

			dates.clear()
			o(festivals.future().length === 1).equals(false)`find status of missing festival`
			o(festivals.future(daysAhead).length === 1).equals(false)`no dates`
		})
	})
	//intended(intentions),

	o.spec("intended", function () {
		const bigHorizon = 400
		o('intended', function () {
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
			o(festivals.intended(bigHorizon, { skipDetails: true }).length).equals(0)`no intentions, date in future`

			dates.clear()
			dates.replaceList(pastDates)
			intentions.replaceList(noIntentions)
			o(festivals.intended(bigHorizon, { skipDetails: true }).length).equals(0)`no intentions, no date in future`

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
			o(festivals.intended(bigHorizon, { skipDetails: true }).length).equals(0)`intention for date, date has passed, other dates for festival in future`

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

			o(festivals.intended(bigHorizon, { skipDetails: true }).length).equals(1)`intention for date, date in future, other dates for festival in past`


		})
	})

	/*
		//update -> create
		o.spec("update", function() {
			const id = 44
			const data = []
			
			o.spec("update", function() {
				//
				o("resolve", function(done) {
					const v = festivals.update(data, id, {
						remoteData: validData,
						remoteResult: 'resolve'
					})
						.then(check => {
							o(check).equals(`/api/${festivals.fieldName}/update?where={"id":${id}}`) `update`
						})
						.then(done)
						.catch(err => {
							o(err).equals('dead') `rejection`
							done()
						})
	
				})
	
				//
				o("reject", function(done) {
				const j = festivals.update(data, id, {
					remoteData: validData,
					remoteResult: 'reject'
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
		})
		*/
	//festivalIds(subjects),
	//getPromise,
	//festivalDetails(subjects, lineups, images, artistAliases, genres, artistGenres, parentGenres, artistPriorities, intentions)
})