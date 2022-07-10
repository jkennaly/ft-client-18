// src/store/list/mixins/remote/details/set.js



import _ from 'lodash'
import globals from '../../../../../services/globals'
var bulkUpdateSubjectCache = {}

const cacheLife = 1000 * 3600 // 1 hour

var lastLoad = {}

var lastUpdate = {}
var lastPromise = {}
export default ({ days, dates, series, festivals }) => {
	return {
		subjectDetails(so) {
			if (!so || !so.subjectType || !so.subject) {
				return Promise.reject('No subject object for subjectDetails')
			}
			if (so.subjectType !== this.subjectType) return Promise.reject(`No set subjectType mismatch ${so.subjectType} !== ${this.subjectType}`)

			const key = `[${so.subjectType}][${so.subject}]`
			const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)


			//get subjectData from the model, loading from the server if needed
			//for each subject Type, collect detail information
			series.remoteCheck()
			festivals.remoteCheck()

			var updated = false
			if ((updateTimeElapsed < 5 * 60 * 1000) && _.get(lastPromise, key)) return _.get(lastPromise, key, (() => Promise.reject('cache inconsistent ' + key)()))
			if (updateTimeElapsed < 5 * 60 * 1000) return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(this.subjectDetails(so))
				}, 1 * 1000)
			})
			_.set(lastUpdate, key, Date.now())

			const p = this.getLocalPromise(so.subject)
				.then(([subjectData, upd]) => {
					updated = updated || upd
					//console.log('set subjectDetails getLocalPromise resolved', subjectData, upd)
					return subjectData
				})
				.then(subjectData => days.subjectDetails({ subject: subjectData.day, subjectType: globals.DAY }))
				.then(upd => updated = updated || upd)
				.then(upd => {
					//console.log('set reply', upd)
					return upd
				})
				.catch(err => {
					console.log('this subjectDetails Promise.all', this.fieldName)
					console.error(err)
				})
				.then(() => updated)
			_.set(lastPromise, key, p)
			return p

		}
	}
}