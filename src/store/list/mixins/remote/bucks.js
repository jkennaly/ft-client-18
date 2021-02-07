// src/store/list/mixins/remote/bucks.js

import _ from 'lodash'

import provide from '../../../loading/provide'

var lastUpdate = {}
var lastPromise = {}
const cacheLife = 30 * 1000
const totalize = raw => {
	const data = _.isArray(raw) ? raw : raw.data
	return data.reduce((total, row) => total + row.bucks, 0)

}
var buyInProgress = false
export default {
	bucks (opts = {}) { 
		const end = `/api/${this.fieldName}/bucks`
		//console.log('bucks ' + end)
		const key = end
		const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)
		if((updateTimeElapsed < cacheLife) && _.get(lastPromise, key)) return _.get(lastPromise, key, (() => Promise.reject('cache inconsistent ' + key)())).then(p => opts.total ? totalize(p) : p)
		if(updateTimeElapsed < cacheLife) return new Promise((resolve, reject) => {
		    setTimeout(() => {
		        resolve(this.bucks(opts))
		    }, 1 * 1000)
		})
		_.set(lastUpdate, key, Date.now())

		const p = provide(undefined, this.fieldName, '', end, 'GET')
			//.then(c => {console.log('bucks response', c); return c})
		
		_.set(lastPromise, key, p)
		return opts.total ? p.then(totalize) : p
	},
	buyBucks (data) {
		if(buyInProgress) return Promise.reject(false)
		buyInProgress = true
		const end = `/api/${this.fieldName}/bucks`
		const checkout = provide(data, this.fieldName, '', end, 'POST')
			.finally(x => {
				buyInProgress = false
				return x
			})
		return checkout
	}
}