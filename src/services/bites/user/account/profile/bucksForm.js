// src/services/bites/user/account/profile/bucksForm.js


import m from 'mithril'
import _ from 'lodash'

import ContentItem from '../../../../../components/detailViewsPregame/profiles/ContentItem.js'

const biteCache = {}
const biteTimes = {}
const cacheLife = 1000

const STRIPE_PK = typeof STRIPE_PUBLIC === 'undefined' ? {} : STRIPE_PUBLIC
//console.log('bucksForm PK', STRIPE_PK)
var stripe = Stripe(STRIPE_PK['STRIPE_PUBLIC'])
      

const dataPromise = (remoteDataField) => remoteDataField
	.bucks({total: true})
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
var buySmall = false
var buyCount = 10

const extractToggle = () => {
	extracted = !extracted
	//console.log('extractToggle', extracted)
}
export default  (remoteDataField) => {
	const currentBucks = cachedBite(remoteDataField)
	//console.log('bucksForm currentBucks', currentBucks)
	const title = 'Order FestiBucks'
	if(!_.isNumber(currentBucks)) return {
		value: 'Loading',
		title: title,
		public: false,
		name: title
	}

	const ledgerItems = l => _.map(l, (v, k) => m(ContentItem, {name: k, value: v}))

	let runningBalance = 0
	const bucksForm = m(`form${extracted ? '' : '.c44-dn'}`, {}, 
		//form title
		m('h2', {}, 'Buy FestiBucks'),
		//current bucks
		m('', {}, `Current FestiBucks: ${currentBucks}`),
		//selector: <10 or 10+
		m('select', {onchange: e => {
			buySmall = e.target.value === 'small' 
			if(buySmall && buyCount > 6) buyCount = 6
			if(!buySmall && buyCount < 10) buyCount = 10
		}},
			m('option', {value: 'small', selected: buySmall}, 'Buy 1-6 @ $1.50 ea'), 
			m('option', {value: 'large', selected: !buySmall}, 'Buy 10+ @ $1.00 ea')
		),
		//count input
		m(`input[type=number][min=${buySmall ? 1 : 10}]${buySmall ? '[max=6]' : ''}[value=${buyCount}]`, {
			onchange: e => buyCount = parseInt(e.target.value, 10)
		}),
		m(`table`, {}, 
			m('tr', {}, 
				m('th', {}, 'FestiBucks'), 
				m('th', {}, 'Price'), 
				m('th', {}, 'Balance After Transaction')
			),
			m('tr', {}, 
				m('td', {}, buyCount), 
				m('td', {}, buyCount * (buySmall ? 1.5 : 1)), 
				m('td', {}, buyCount + currentBucks)
			)

		),
		//alpha warning
		m('', {}, 'This is alpha software under active development and there could be issues.'),
		//redirection warning
		m('', {}, 'Clicking the buy button will transfer you to our seecure checkout site.'),
		//buy button
		m('button', {
			onclick: e => {
				return remoteDataField.buyBucks({
					quantity: buyCount,
					successUrl: window.location.href,
					cancelUrl: window.location.href
				})
				.then(res => {
					const data = res.data
					if(!data || !data.id) throw new Error('No session created')
					return stripe.redirectToCheckout({sessionId: data.id})
				})
		        .then(function(result) {
		          // If `redirectToCheckout` fails due to a browser or network
		          // error, you should display the localized error message to your
		          // customer using `error.message`.
		          if (result.error) {
		            alert(result.error.message);
		          }
		        })
		        .catch(function(error) {
		          console.error('Error:', error);
		        });
				//.then(console.log)
			}
		}, 'Buy Bucks')
	)
	return {
		value: bucksForm,
		title: title,
		public: false,
		name: title,
		extractable: true,
		extractToggle: extractToggle,
		extracted: extracted
	}
}