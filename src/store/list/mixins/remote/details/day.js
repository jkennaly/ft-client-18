// src/store/list/mixins/remote/details/day.js



import _ from 'lodash'
var bulkUpdateSubjectCache = {}

export default ({sets, series, festivals, dates, places}) => {return{
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails')
		}
		if(so.subjectType !== this.subjectType) return Promise.reject(`No day subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information
		series.remoteCheck()
		festivals.remoteCheck()

		var updated = false
		return this.getLocalPromise(so.subject)
			.then(([subjectData, upd]) => {
				updated = updated || upd
				//console.log('day subjectDetails getLocalPromise resolved', subjectData, upd)
				return subjectData
			})
			.then(subjectData => dates.subjectDetails({subject: subjectData.date, subjectType: DATE}))
			.then(upd => updated = updated || upd)
			.then(upd => {
				//console.log('day reply', upd)
				return upd
			})
			.catch(err => {
				console.log('this subjectDetails Promise.all', this.fieldName)
				console.error(err)
			})
			.then(() => updated)

		}
}}