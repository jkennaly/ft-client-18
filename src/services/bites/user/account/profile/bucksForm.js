// src/services/bites/user/account/profile/bucksForm.js

import m from "mithril"
import _ from "lodash"

import ContentItem from "../../../../../components/detailViewsPregame/profiles/ContentItem.js"
import IconText from "../../../../../components/fields/IconText.jsx"

var biteCache = {}
var biteTimes = {}
const cacheLife = 10

const dataPromise = remoteDataField =>
	remoteDataField.bucks({ total: true }).then(fav => {
		_.set(biteTimes, `dataPromise[${0}]`, Date.now())
		_.set(biteCache, `dataPromise[${0}]`, fav)
		return fav
	})
const cachedBite = remoteDataField => {
	const cacheTime = _.get(biteTimes, `dataPromise[${0}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) dataPromise(remoteDataField).catch(console.log)
	return _.get(biteCache, `dataPromise[${0}]`, [])
}

var extracted = false
var buySmall = false
var buyCount = 10

const extractToggle = () => {
	extracted = !extracted
	//console.log('extractToggle', extracted)
}
// Create our number formatter.
var formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD"

	// These options are needed to round to whole numbers if that's what you want.
	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})
export default (remoteDataField, eventObject = {}) => {
	const STRIPE_PK = typeof STRIPE_PUBLIC === "undefined" ? {} : STRIPE_PUBLIC
	//console.log('bucksForm PK', STRIPE_PK)
	var stripe =
		typeof Stripe !== "undefined" ? Stripe(STRIPE_PK["STRIPE_PUBLIC"]) : undefined

	if (!stripe) return ""
	const currentBucks = cachedBite(remoteDataField)
	//console.log("bucksForm currentBucks", currentBucks)
	const title = "Order FestiBucks"
	if (!_.isNumber(currentBucks))
		return {
			value: "Loading",
			title: title,
			public: false,
			name: title
		}

	const ledgerItems = l => _.map(l, (v, k) => m(ContentItem, { name: k, value: v }))

	let runningBalance = 0
	const bucksForm = m(
		`form.c44-bcca${extracted ? "" : ".c44-dn"}`,
		{},
		//form title
		m("h2", {}, "Buy FestiBucks"),
		//current bucks
		m(
			"",
			{},
			`Current FestiBucks: `,
			m(IconText, { name: "festibucks" }),
			currentBucks
		),
		//selector: <10 or 10+
		m(
			"select",
			{
				onchange: e => {
					buySmall = e.target.value === "small"
					if (buySmall && buyCount > 6) buyCount = 6
					if (!buySmall && buyCount < 10) buyCount = 10
				}
			},
			m("option", { value: "small", selected: buySmall }, `Buy 1-6 @ $1.50 ea`),
			m("option", { value: "large", selected: !buySmall }, `Buy 10+ @ $1.00 ea`)
		),
		//count input
		m(
			`input.c44-w-ma90[type=number][min=${buySmall ? 1 : 10}]${
				buySmall ? "[max=6]" : ""
			}[value=${buyCount}]`,
			{
				onchange: e => (buyCount = parseInt(e.target.value, 10))
			}
		),
		m(
			`table`,
			{},
			m(
				"tr",
				{},
				m("th", {}, "FestiBucks"),
				m("th", {}, "Price"),
				m("th", {}, "Balance After Transaction")
			),
			m(
				"tr",
				{},
				m("td", {}, m(IconText, { name: "festibucks" }), buyCount),
				m("td", {}, formatter.format(buyCount * (buySmall ? 1.5 : 1))),
				m("td", {}, m(IconText, { name: "festibucks" }), buyCount + currentBucks)
			)
		),
		//alpha warning
		m(
			"",
			{},
			"This is alpha software under active development and there could be issues."
		),
		//redirection warning
		m(
			"",
			{},
			"Clicking the buy button will transfer you to our seecure checkout site."
		),
		//buy button
		m(
			'button[name="BuyBucks"]',
			{
				onclick: e => {
					e.stopPropagation()
					e.preventDefault()
					const su = window.location.href
					const cu = window.location.href
					//console.log("bucksForm BuyBucks onclick", buyCount, cu, su, e)
					return remoteDataField
						.buyBucks({
							quantity: buyCount,
							successUrl: su,
							cancelUrl: cu
						})
						.then(res => {
							console.log("bucksForm", res)
							const data = res.data
							if (!data || !data.id) throw new Error("No session created")
							return stripe.redirectToCheckout({ sessionId: data.id })
						})
						.then(function(result) {
							// If `redirectToCheckout` fails due to a browser or network
							// error, you should display the localized error message to your
							// customer using `error.message`.

							var biteCache = {}
							var biteTimes = {}
							if (result.error) {
								alert(result.error.message)
							}
							return dataPromise(remoteDataField)
						})
						.then(eventObject.bucksUpdate)
						.catch(function(error) {
							console.error("Error:", error)
						})
					//.then(console.log)
				}
			},
			"Buy Bucks"
		)
	)
	return {
		value: bucksForm,
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
