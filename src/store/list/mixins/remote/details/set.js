// src/store/list/mixins/remote/details/set.js



import _ from 'lodash'
var bulkUpdateSubjectCache = {}

export default ({days, dates, series, festivals}) => {return{
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails')
		}
		if(so.subjectType !== this.subjectType) return Promise.reject(`No set subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information
		series.remoteCheck()
		festivals.remoteCheck()

		var updated = false
		return this.getLocalPromise(so.subject)
			.then(([subjectData, upd]) => {
				updated = updated || upd
				//console.log('set subjectDetails getLocalPromise resolved', subjectData, upd)
				return subjectData
			})
			.then(subjectData => days.subjectDetails({subject: subjectData.day, subjectType: DAY}))
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

		}
}}