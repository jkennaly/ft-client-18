// src/store/list/mixins/remote/details/date.js



import _ from 'lodash'

var lastUpdate = {}
var lastPromise = {}
export default ({ artists, days, sets, messages, series, festivals, venues, places }, lineups, intentions) => {
	return {
		subjectDetails(so) {
			if (!so || !so.subjectType || !so.subject) {
				return Promise.reject('No subject object for subjectDetails' + JSON.stringify(so))
			}
			if (so.subjectType !== this.subjectType) throw new Error(`No date subjectType mismatch ${so.subjectType} !== ${this.subjectType}`)


			//get subjectData from the model, loading from the server if needed
			//for each subject Type, collect detail information

			//assumes all series loaded from core
			//assumes all festivals loaded from core
			//assumes all venues loaded from core

			const key = `[${so.subjectType}][${so.subject}]`
			const updateTimeElapsed = Date.now() - _.get(lastUpdate, key, 0)
			var updated = false
			//return if less than 5 minutes elapsed
			//console.log('date subjectDetails', updateTimeElapsed, updateTimeElapsed < 5 * 60 * 1000, _.get(lastPromise, key))
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
					//console.log('date subjectDetails getLocalPromise resolved', subjectData, upd)
					return subjectData
				})
				.then(subjectData => {
					if (!subjectData) throw new Error(`No subject found ${JSON.stringify(subjectData)}`)
					series.remoteCheck(true)
					festivals.remoteCheck(true)
					venues.remoteCheck(true)
					intentions.remoteCheck(true)

					//lineups
					const lineEnd = `/api/Lineups`
					const lineQuery = `filter=` + JSON.stringify({
						where: {
							festival: subjectData.festival
						}
					})

					//days
					const dayEnd = `/api/Days`
					const dayQuery = `filter=` + JSON.stringify({
						where: {
							date: subjectData.id
						}
					})
					return Promise.all([
						lineups.acquireListSupplement(lineQuery, lineEnd)
							.then(upd => updated = updated || upd)
							//artists
							.then(() => lineups.getFiltered({ festival: subjectData.festival })
								.map(x => x.band)
							)
							.then(artistIds => artists.getManyPromise(artistIds)),
						days.acquireListSupplement(dayQuery, dayEnd)
							.then(upd => updated = updated || upd)
							//sets
							.then(() => days.getFiltered({ date: so.subject })
								.map(x => x.id)
							)
							.then(dayIds => {
								sets.acquireListSupplement(`filter=${JSON.stringify({ where: { day: { inq: dayIds } } })}`)
							}),
						places.acquireListSupplement(`filter=${JSON.stringify({ where: { festival: subjectData.festival } })}`)
						,
						messages.loadForFestival(subjectData.festival)
							.then(upd => updated = updated || upd)
					])
				})
				.then(() => updated)
				.then(upd => {
					//console.log('date reply', upd)
					return upd
				})
				.catch(err => {
					console.log('this subjectDetails Promise.all')
					console.log(err)
				})
			_.set(lastPromise, key, p)
			return p

		}
	}
}