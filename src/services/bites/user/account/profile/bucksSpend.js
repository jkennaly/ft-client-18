// src/services/bites/user/account/profile/bucksSpend.js


import m from 'mithril'
import _ from 'lodash'
import moment from 'dayjs'

import BuyAccessLine from '../../../../../components/fields/form/BuyAccessLine.jsx'
import EventSelector from '../../../../../components/detailViewsPregame/fields/event/EventSelector.jsx'
import IconText from '../../../../../components/fields/IconText.jsx'

const biteCache = {}
const biteTimes = {}
const cacheLife = 10

const STRIPE_PK = typeof STRIPE_PUBLIC === 'undefined' ? {} : STRIPE_PUBLIC
//console.log('bucksSpend PK', STRIPE_PK)
var stripe = typeof Stripe !== 'undefined' ? Stripe(STRIPE_PK['STRIPE_PUBLIC']) : undefined
      

const endPromise = (users) => users
	.wouldend()
	.then(fav => {
		_.set(biteTimes, `endPromise[${0}]`, Date.now())
		_.set(biteCache, `endPromise[${0}]`, fav)
		return fav
	})
const cachedEndBite = (users) => {
	const cacheTime = _.get(biteTimes, `endPromise[${0}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) endPromise(users)
		.catch(console.log)
	return _.get(biteCache, `endPromise[${0}]`, [])
}
const dataPromise = (users) => users
	.bucks({total: true})
	.then(fav => {
		_.set(biteTimes, `dataPromise[${0}]`, Date.now())
		_.set(biteCache, `dataPromise[${0}]`, fav)
		return fav
	})
const cachedBite = (users) => {
	const cacheTime = _.get(biteTimes, `dataPromise[${0}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) dataPromise(users)
		.catch(console.log)
	return _.get(biteCache, `dataPromise[${0}]`, [])
}

const costPromise = (rdf, id) => rdf
	.cost(id)
	.then(data => data.data ? data.data : data)
	.then(fav => {
		_.set(biteTimes, `dataPromise.${rdf.fieldName}[${id}]`, Date.now())
		_.set(biteCache, `dataPromise.${rdf.fieldName}[${id}]`, fav)
		return fav
	})
	.then(data => {
		m.redraw()
		return data
	})
const cachedCostBite = (rdf, id) => {
	const cacheTime = _.get(biteTimes, `dataPromise.${rdf.fieldName}[${id}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) costPromise(rdf, id)
		.catch(console.log)
	return _.get(biteCache, `dataPromise.${rdf.fieldName}[${id}]`, [])
}


var extracted = false
var buySmall = false
var buyCount = 10

const extractToggle = () => {
	extracted = !extracted
	//console.log('extractToggle', extracted)
}

var dayIdCache = 0
var dateIdCache = 0
var festivalIdCache = 0
var seriesIdCache = 0
const cacheId = (radix, id) => {
	switch (radix) {
		case 'series': {
			dayIdCache = 0
			dateIdCache = 0
			festivalIdCache = 0
			seriesIdCache = id
			break
		}
		case 'fest': {
			dayIdCache = 0
			dateIdCache = 0
			festivalIdCache = id
			break
		}
		case 'date': {
			dayIdCache = 0
			dateIdCache = id
			break
		}
		case 'day': {
			dayIdCache = id
			break
		}
		default: {
			break
		}
	}
}
const onchange = radix => e => { 
	const newId = _.isInteger(e) ? e : parseInt(e.target.value, 10)
	console.log('bucksSpend', radix, newId)
	return cacheId(radix, newId)

}
const extractEvent = eo => {
	if(eo.subjectType === SERIES) return {
		seriesId: eo.subject
	}

}
export default  (users, days, dates, festivals, eventObject = {}) => {
	const currentBucks = cachedBite(users)
	const endTime = cachedEndBite(users)
	const currentId = dayIdCache || dateIdCache || festivalIdCache
	
	if(eventObject.seriesId) seriesIdCache = eventObject.seriesId
	if(eventObject.festivalId) festivalIdCache = eventObject.festivalId
	if(eventObject.dateId) dateIdCache = eventObject.dateId
	if(eventObject.dayId) dayIdCache = eventObject.dayId
	
	const rdf = dayIdCache ? days :
		dateIdCache ? dates :
		festivalIdCache ? festivals :
		users
	if(festivalIdCache && !dateIdCache) dates.acquireListSupplement((`filter=${JSON.stringify({where: {festival: festivalIdCache}})}`))
	if(dateIdCache && !dayIdCache) days.acquireListSupplement((`filter=${JSON.stringify({where: {date: dateIdCache}})}`))
	const costObject = cachedCostBite(rdf, currentId)
	if(dateIdCache) costObject.dateId = dateIdCache
	if(festivalIdCache) costObject.festivalId = festivalIdCache
	//console.log('bucksSpend currentBucks endTime', endTime, currentBucks, costObject)
	const title = 'Festival Access'
	if(!_.isNumber(currentBucks)) return {
		value: 'Loading',
		title: title,
		public: false,
		name: title
	}
	/*
	console.log('bucksSpend form', {
		seriesId: seriesId(),
		festivalId: festivalId(),
		dateId: dateId(),
		dayId: dayId()
	})
	*/
	const bucksSpend = m(`form.c44-bcca.c44-w-90.c44-fjcc${extracted ? '.c44-fvf' : '.c44-dn'}`, {}, 
		//form title
		m('h2.c44-tac', {}, 'Buy Live Access'),
		//current bucks
		m('span.c44-tac', {}, `Current FestiBucks: `, 
			m(IconText, {name: 'festibucks'}),
			currentBucks
		),
		//selector: event
		eventObject.festivalId ? '' : m(EventSelector, {
			seriesId: seriesIdCache,
			festivalId: festivalIdCache,
			dateId: dateIdCache,
			dayId: dayIdCache,
			seriesChange: onchange('series'),
			festivalChange: onchange('fest'),
			dateChange: onchange('date'),
			dayChange: onchange('day')
		}),
		..._.map(costObject, 
			(v, k, a) => /Id$/.test(k) ? '' : m(BuyAccessLine, {
				name: k === 'day' ? festivals.getEventName(festivalIdCache) :
						k === 'date' ? festivals.getEventName(festivalIdCache) :
						k === 'festival' ? festivals.getEventName(festivalIdCache) :
						k === 'full' ? 'Full Access' :
						k, 
				subtitle: k === 'day' ? days.getEventNameArray(dayIdCache).reduce((n, pn, i) => {
					if(i === 2) n = pn
					if(i === 3) n = `${n} ${pn}`
					return n
				}, '') :
						k === 'date' ? dates.getPartName(dateIdCache) :
						k === 'festival' ? 'All Dates' :
						k === 'full' ? 'All events through ' + moment(endTime).format('ll') :
						k, 
				value: v, 
				accessLevel: k,
				clickFunction: e => {
					e.stopPropagation()
					e.preventDefault()
					const rdf = k === 'day' ? days :
						k === 'date' ? dates :
						k === 'festival' ? festivals :
						users
					const id = k === 'day' ? dayIdCache :
						k === 'date' ? dateIdCache :
						festivalIdCache
					let buyObject = {}
					buyObject[k] = v
					buyObject[`${k}Id`] = a[`${k}Id`]
					//console.log('bucksSpend buyObject', buyObject)
					return rdf.buy(buyObject)
						.then(eventObject.bucksUpdate)
						.then(eventObject.closeModal)
				},
				unaffordable: currentBucks < v
			}))
	)
	return {
		value: bucksSpend,
		title: title,
		public: false,
		name: title,
		extractable: true,
		extractToggle: () => {
			extractToggle()
			eventObject.extraction && eventObject.extraction(extracted)

		},
		extracted: extracted
	}
}