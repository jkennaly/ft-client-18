// src/store/list/mixins/remote/details/flag.js



import _ from 'lodash'

export default (messages) => { return {
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails')
		}
		if(so.subjectType !== this.subjectType) return Promise.reject(`No flag subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )

		//console.log('subjectDetails', so)
		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		//assumes all series loaded from core
		//assumes all festivals are loaded from core

		var updated = false

		return this.getLocalPromise(so.subject)
			.then(subjectData => {
				//direct messages
				const skipIds = messages
					.getFiltered({subjectType: FLAG, subject: subjectData.id})
					.map(x => x.id)
				const messEnd = `/api/Messages`
				const messQuery = `filter=` + JSON.stringify({where: {and: [
					{subject: so.subject},
					{subjectType: so.subjectType},
					{id: {nin: skipIds}}
				]}})
				return messages.acquireListSupplement(messQuery, messEnd)
					.then(upd => updated = updated || upd)
					.then(() => {
						const bases = messages.getFiltered({subjectType: FLAG, subject: subjectData.id})
							.map(x => x.id)
						const discuss = messages.getFiltered({baseMessage: {inq: bases}})
							.map(x => x.id)

						const messQuery = `filter=` + JSON.stringify({where: {and: [
							{baseMessage: {inq: bases}},
							{id: {nin: discuss}}
						]}})
						return messages.acquireListSupplement(messQuery, messEnd)
							.then(upd => updated = updated || upd)
					})
					
			})
			.then(() => updated)
			
			.catch(err => {
				console.log('this subjectDetails flag')
				console.log(err)
			})

	}
}}