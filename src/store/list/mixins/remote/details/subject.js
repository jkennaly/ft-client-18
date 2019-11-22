// subject.js



import _ from 'lodash'
var bulkUpdateSubjectCache = {}

export default {
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails')
		}
		if(so.subjectType !== this.subjectType) throw new Error(`No subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		return this.getPromise(so.subject)
			.then(s => Boolean(s))
			.catch(err => {
				console.log('this subjectDetails Promise.all')
				console.log(err)
			})

		}
}