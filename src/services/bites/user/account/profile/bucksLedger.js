// src/services/bites/user/account/profile/bucksLedger.js


import m from 'mithril'
import _ from 'lodash'

import ContentItem from '../../../../../components/detailViewsPregame/profiles/ContentItem.js'

const biteCache = {}
const biteTimes = {}
const cacheLife = 10


const dataPromise = (remoteDataField) => remoteDataField
	.bucks()
	.then(fav => {
		_.set(biteTimes, `dataPromise[${0}]`, Date.now())
		_.set(biteCache, `dataPromise[${0}]`, fav)
		return fav
	})
const cachedBite = (remoteDataField) => {
	const cacheTime = _.get(biteTimes, `dataPromise[${0}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) dataPromise(remoteDataField)
		.catch(console.log)
	return _.get(biteCache, `dataPromise[${0}]`, [])
}

var extracted = false

const extractToggle = () => {
	extracted = !extracted
	//console.log('extractToggle', extracted)
}
export default  (remoteDataField) => {
	const raw = cachedBite(remoteDataField)
	const data = _.isArray(raw) ? raw : raw.data
	//console.log('bucksLedger data', data)
	const title = 'FestiBucks Ledger'
	if(!data || !data.sort) return {
		value: 'Loading',
		title: title,
		public: false,
		name: title
	}

	const ledgerItems = l => _.map(l, (v, k) => m(ContentItem, {name: k, value: v}))

	let runningBalance = 0
	const bucksLedger = m(`table${extracted ? '' : '.c44-dn'}`, {}, 
		m('tr', {}, 
			m('th', {}, 'Time'), 
			m('th', {}, 'Category'), 
			//m('th', {}, 'Details'), 
			m('th', {}, 'Amount'), 
			m('th', {}, 'Running Balance')
		),
		data
			.sort((a, b) => a.id - b.id)
			.map(row => {
				row.rb = runningBalance = runningBalance + row.bucks
				return row
			})
			.sort((a, b) => b.id - a.id)
			.map(row => m('tr', {}, 
				m('td', {}, row.timestamp), 
				m('td', {}, row.category), 
		
				//m('td', {}, ledgerItems(JSON.parse(row.description))), 

				m('td', {}, row.bucks), 
				m('td', {}, row.rb)
			)),
		m('tr', {}, 
			m('td', {}, ''), 
			m('td', {}, 'Initial'), 
			//m('td', {}, ''), 
			m('td', {}, 0), 
			m('td', {}, 0)
		),
	)
	return {
		value: bucksLedger,
		title: title,
		public: false,
		name: title,
		extractable: true,
		extractToggle: extractToggle,
		extracted: extracted
	}
}