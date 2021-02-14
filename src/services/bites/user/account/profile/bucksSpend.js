// src/services/bites/user/account/profile/bucksSpend.js


import m from 'mithril'
import _ from 'lodash'

import BuyAccessLine from '../../../../../components/fields/form/BuyAccessLine.jsx'
import EventSelector from '../../../../../components/detailViewsPregame/fields/event/EventSelector.jsx'

const biteCache = {}
const biteTimes = {}
const cacheLife = 1000

const STRIPE_PK = typeof STRIPE_PUBLIC === 'undefined' ? {} : STRIPE_PUBLIC
//console.log('bucksSpend PK', STRIPE_PK)
var stripe = Stripe(STRIPE_PK['STRIPE_PUBLIC'])
      

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
export default  (users, days, dates, festivals) => {
	const currentBucks = cachedBite(users)
	const currentId = dayIdCache || dateIdCache || festivalIdCache

	const rdf = dayIdCache ? days :
		dateIdCache ? dates :
		festivalIdCache ? festivals :
		users
	if(festivalIdCache && !dateIdCache) dates.acquireListSupplement((`filter=${JSON.stringify({where: {festival: festivalIdCache}})}`))
	if(dateIdCache && !dayIdCache) days.acquireListSupplement((`filter=${JSON.stringify({where: {date: dateIdCache}})}`))
	const costObject = cachedCostBite(rdf, currentId)
	//console.log('bucksSpend currentBucks', currentBucks, costObject)
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
	const bucksSpend = m(`form${extracted ? '' : '.c44-dn'}`, {}, 
		//form title
		m('h2', {}, 'Buy Live Festival Access'),
		//current bucks
		m('', {}, `Current FestiBucks: ${currentBucks}`),
		//selector: event
		m(EventSelector, {
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
				name: k, 
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
					console.log('bucksSpend buyObject', buyObject)
					return rdf.buy(buyObject)
				}
			}))
	)
	return {
		value: bucksSpend,
		title: title,
		public: false,
		name: title,
		extractable: true,
		extractToggle: extractToggle,
		extracted: extracted
	}
}