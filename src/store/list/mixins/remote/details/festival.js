// festival.js



import _ from 'lodash'

export default ({artists, dates, messages}, lineups) => { return {
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails festival ' + JSON.stringify(so))
		}
		if(so.subjectType !== this.subjectType) return Promise.reject(`No festival subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		//assumes all series loaded from core

		var updated = false
		return this.getPromise(so.subject)
			.then(subjectData => {
				//lineups
				const lineEnd = `/api/Lineups`
				const lineQuery = `filter=` + JSON.stringify({where: {
					festival: so.subject
				}})
				
				//dates
				const dateEnd = `/api/Dates`
				const dateQuery = `filter=` + JSON.stringify({where: {
					festival: so.subject
				}})
				return Promise.all([
					lineups.acquireListUpdate(lineQuery, lineEnd)
						.then(upd => updated = updated || upd)
						//artists
						.then(() => lineups.getFiltered({festival: so.subject})
							.map(x => x.band)
						)
						.then(artistIds => artists.getManyPromise(artistIds)),
					dates.acquireListUpdate(dateQuery, dateEnd)
						.then(upd => updated = updated || upd),
					messages.loadForFestival(so.subject)
						.then(upd => updated = updated || upd)
				])
			})
			.then(() => updated)
			.catch(err => {
				console.log('this subjectDetails Promise.all')
				console.log(err)
			})

		}
}}