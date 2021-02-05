// src/store/list/mixins/remote/details/user.js



import _ from 'lodash'
var bulkUpdateSubjectCache = {}

export default (interactions) => {return{
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails')
		}
		if(so.subjectType !== this.subjectType) throw new Error(`No subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		var updated = false
		return this.getLocalPromise(so.subject)
			.then(([data, s]) => updated = updated ||  Boolean(s))
			.then(() => {
				//console.log('user subjectDetails interactions')
				const interEnd = interactions.baseEndpoint
				const localIds = interactions.getFiltered({user: so.subject}).map(x => x.id)
				const interQuery = `filter=${JSON.stringify({
					where: { and: [
						{user: so.subject},
						{id: {nin: localIds}}
					]}
				})}`
				return interactions.acquireListSupplement(interQuery, interEnd)
						.then(upd => updated = updated || upd)
						//artists
						.then(() => interactions.getFiltered({user: so.subject})
							.map(x => x.subject)
						)
						.then(userIds => this.getManyPromise(userIds, {upd: true}))
						.then(upd => updated = updated || upd)
			})                                                                                           
			
			.catch(err => {
				console.log('this subjectDetails Promise.all')
				console.log(err)
			})

		}
}}