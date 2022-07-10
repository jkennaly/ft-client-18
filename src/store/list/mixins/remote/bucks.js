// src/store/list/mixins/remote/bucks.js

import _ from 'lodash'

import provide from '../../../loading/provide'

var lastUpdate = {}
var lastPromise = {}
var lastValue = {}
const cacheLife = 30 * 1000
const totalize = raw => {
	if (!raw) return 0
	const data = _.isArray(raw) ? raw : raw.data
	return data.reduce((total, row) => total + row.bucks, 0)

}
var buyInProgress = false
export default {
	wouldend(opts = {}) {
		const end = `/api/${this.fieldName}/access/wouldend`
		//console.log('bucks ' + end)
		const key = end
		const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)
		if ((updateTimeElapsed < cacheLife) && _.get(lastPromise, key)) return _.get(lastPromise, key, (() => Promise.reject('cache inconsistent ' + key)())).then(p => opts.total ? totalize(p) : p)
		if (updateTimeElapsed < cacheLife) return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.wouldend(opts))
			}, 1 * 1000)
		})
		_.set(lastUpdate, key, Date.now())

		const p = provide(undefined, this.fieldName, '', end, 'GET')
			.then(x => x.data * 1000)
			.then(c => {
				lastValue[key] = c
				//.reduce((total, entry) => total + entry.bucks, 0)

				return c

			})
		//.then(c => {console.log('bucks response', c); return c})

		_.set(lastPromise, key, p)
		return opts.total ? p.then(totalize) : p
	},
	bucks(opts = {}) {
		const end = `/api/${this.fieldName}/bucks`
		//console.log('bucks ' + end)
		const key = end
		const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)
		if ((updateTimeElapsed < cacheLife) && _.get(lastPromise, key)) return _.get(lastPromise, key, (() => Promise.reject('cache inconsistent ' + key)())).then(p => opts.total ? totalize(p) : p)
		if (updateTimeElapsed < cacheLife) return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.bucks(opts))
			}, 1 * 1000)
		})
		_.set(lastUpdate, key, Date.now())

		const p = provide(undefined, this.fieldName, '', end, 'GET')
			.then(c => {
				lastValue[key] = _.get(c, 'data', [])
					.reduce((total, entry) => total + entry.bucks, 0)

				return c

			})
		//.then(c => {console.log('bucks response', c); return c})

		_.set(lastPromise, key, p)
		return opts.total ? p.then(totalize) : p
	},
	buyBucks(data) {
		console.log('buyBucks', buyInProgress, data, this.fieldName)
		if (buyInProgress) return Promise.reject(false)
		buyInProgress = true
		const end = `/api/${this.fieldName}/bucks`
		const checkout = provide(data, this.fieldName, '', end, 'POST')
			.then(x => console.log('bucksBought', x) || x)
			.finally(x => {
				buyInProgress = false
				lastUpdate = {}
				lastPromise = {}
				lastValue = {}
				return x
			})
		return checkout
	},
	endCache(id) {
		if (!id) return Promise.resolve(true)
		const end = `/api/${this.fieldName}/access/wouldend`
		//console.log('cost ' + end)
		const key = end
		if (_.isUndefined(lastValue[key])) {
			this.wouldend(id)
		}
		return lastValue[key]
	},
	bucksCache(id) {
		if (!id) return Promise.resolve(true)
		const end = `/api/${this.fieldName}/bucks`
		//console.log('cost ' + end)
		const key = end
		if (_.isUndefined(lastValue[key])) {
			this.bucks(id)
		}
		return lastValue[key]
	},
	accessCache(id) {
		if (!id) return Promise.resolve(true)
		const end = `/api/${this.fieldName}/bucks`
		//console.log('cost ' + end)
		const key = end
		if (_.isUndefined(lastValue[key])) {
			this.bucks(id)
		}
		return lastValue[key]
	}
}