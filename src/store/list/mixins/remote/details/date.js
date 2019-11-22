// date.js



import _ from 'lodash'

var lastUpdate = {}
export default ({artists, days, sets, messages, series, festivals, venues, places}, lineups, intentions) => { return {
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails' + JSON.stringify(so))
		}
		if(so.subjectType !== this.subjectType) throw new Error(`No date subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		//assumes all series loaded from core
		//assumes all festivals loaded from core
		//assumes all venues loaded from core
		
		const key = `[${so.subjectType}][${so.subject}]`
		const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)
		var updated = false
		//return if less than 5 minutes elapsed
		if(updateTimeElapsed < 5 * 60 * 1000) return Promise.resolve(updated)
		_.set(lastUpdate, key, Date.now())

		return this.getPromise(so.subject)
			.then(subjectData => {
				series.remoteCheck(true)
				festivals.remoteCheck(true)
				venues.remoteCheck(true)

				//lineups
				const lineEnd = `/api/Lineups`
				const lineQuery = `filter=` + JSON.stringify({where: {
					festival: subjectData.festival
				}})
				
				//days
				const dayEnd = `/api/Days`
				const dayQuery = `filter=` + JSON.stringify({where: {
					date: subjectData.id
				}})
				return Promise.all([
					lineups.acquireListUpdate(lineQuery, lineEnd)
						.then(upd => updated = updated || upd)
						//artists
						.then(() => lineups.getFiltered({festival: subjectData.festival})
							.map(x => x.band)
						)
						.then(artistIds => artists.getManyPromise(artistIds)),
					days.acquireListUpdate(dayQuery, dayEnd)
						.then(upd => updated = updated || upd)
						//sets
						.then(() => days.getFiltered({date: so.subject})
							.map(x => x.id)
						)
						.then(dayIds => {
							sets.acquireListUpdate(`filter=${JSON.stringify({where: {day: {inq: dayIds}}})}`)
						}),
					places.acquireListUpdate(`filter=${JSON.stringify({where: {festival: subjectData.festival}})}`)
					,
					messages.loadForFestival(subjectData.festival)
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