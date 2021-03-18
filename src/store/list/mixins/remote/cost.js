// src/store/list/mixins/remote/cost.js

import _ from 'lodash'

import provide from '../../../loading/provide'

var lastUpdate = {}
var lastPromise = {}
const cacheLife = 30 * 1000
const totalize = raw => {
	const data = _.isArray(raw) ? raw : raw.data
	return data.reduce((total, row) => total + row.cost, 0)

}
var buyInProgress = false
export default {
	cost (id) { 
		if(!id) return Promise.resolve(true)
		const end = `/api/${this.fieldName}/cost/${this.fieldName === 'Profiles' ? 'full' :  id}`
		//console.log('cost ' + end)
		const key = end
		const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)
		if((updateTimeElapsed < cacheLife) && _.get(lastPromise, key)) return _.get(lastPromise, key, (() => Promise.reject('cache inconsistent ' + key)()))
		if(updateTimeElapsed < cacheLife) return new Promise((resolve, reject) => {
		    setTimeout(() => {
		        resolve(this.cost(id))
		    }, 1 * 1000)
		})
		_.set(lastUpdate, key, Date.now())

		const p = provide(undefined, this.fieldName, '', end, 'GET')
			//.then(c => {console.log('cost response', c); return c})
		
		_.set(lastPromise, key, p)
		return p
	}
}