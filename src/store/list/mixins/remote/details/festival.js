// src/store/list/mixins/remote/details/festival.js

import _ from "lodash"
//console.log('festival subject api', apiUrl)

export default ({ artists, dates, days, sets, messages }, lineups) => {
	return {
		subjectDetails(so) {
			if (!so || !so.subjectType || !so.subject) {
				return Promise.reject(
					"No subject object for subjectDetails festival " +
					JSON.stringify(so)
				)
			}
			if (so.subjectType !== this.subjectType)
				return Promise.reject(
					`No festival subjectType mismatch ${so.subjectType} !== ${this.subjectType
					}`
				)

			//get subjectData from the model, loading from the server if needed
			//for each subject Type, collect detail information

			//assumes all series loaded from core

			var updated = false
			return this.getLocalPromise(so.subject)
				.then(subjectData => {
					//console.log('apiUrl', apiUrl)
					//lineups
					const lineEnd = `/api/Lineups`
					const lineQuery =
						`filter=` +
						JSON.stringify({
							where: {
								festival: so.subject,
							},
						})

					//dates
					const dateEnd = `/api/Dates`
					const dateQuery =
						`filter=` +
						JSON.stringify({
							where: {
								festival: so.subject,
							},
						})
					return Promise.all([
						lineups
							.acquireListSupplement(lineQuery, lineEnd)
							.then(upd => (updated = updated || upd))
							//artists
							.then(() =>
								lineups
									.getFiltered({ festival: so.subject })
									.map(x => x.band)
							)
							.then(artistIds =>
								artists.getManyPromise(artistIds)
							),
						dates
							.acquireListSupplement(dateQuery, dateEnd)
							.then(upd => (updated = updated || upd))
							.then(upd => {
								const dateIds = this.getSubDateIds(so.subject)
								//days
								const dayEnd = `/api/Days`
								const dayQuery =
									`filter=` +
									JSON.stringify({
										where: {
											and: [
												{ date: { inq: dateIds } },
												{ deleted: false },
											],
										},
									})
								return days
									.acquireListSupplement(dayQuery, dayEnd)
									.then(upd => (updated = updated || upd))
							})
							.then(upd => {
								const dayIds = this.getSubDayIds(so.subject)
								//sets
								const setEnd = `/api/Sets`
								const setQuery =
									`filter=` +
									JSON.stringify({
										where: {
											and: [
												{ day: { inq: dayIds } },
												{ deleted: false },
											],
										},
									})
								return sets
									.acquireListSupplement(setQuery, setEnd)
									.then(upd => (updated = updated || upd))
							}),
					])
						.then(() => messages.loadForFestival(so.subject))
						.then(upd => (updated = updated || upd))
				})
				.then(() => updated)
				.catch(err => {
					console.log("this subjectDetails Promise.all")
					console.log(err)
				})
		},
	}
}
