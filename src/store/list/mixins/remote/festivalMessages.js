// src/store/list/mixins/remote/festivalMessages.js

import _ from "lodash"
import globals from "../../../../services/globals"
var bulkUpdateSubjectCache = {}

export default (festivals, lineups) => {
	return {
		loadForFestival(festivalId) {
			//console.log("loadForFestival", festivalId)
			if (!festivalId) {
				return Promise.reject("No festivalId")
			}
			const fest = festivals.get(festivalId)
			if (!fest || !fest.series) {
				return Promise.reject("No fest")
			}
			const setIds = festivals.getSubSetIds(festivalId)
			const dayIds = festivals.getSubDayIds(festivalId)
			const dateIds = festivals.getSubDateIds(festivalId)
			const artistIds = lineups
				.getFiltered(l => l.festival === festivalId)
				.map(l => l.band)
			const subjects = [
				{ subjectType: globals.SET, subject: { inq: setIds } },
				{ subjectType: globals.DAY, subject: { inq: dayIds } },
				{ subjectType: globals.DATE, subject: { inq: dateIds } },
				{ subjectType: globals.FESTIVAL, subject: festivalId },
				{ subjectType: globals.SERIES, subject: fest.series },
				{ subjectType: globals.ARTIST, subject: { inq: artistIds } }
			]
			const filters = subjects.map(s => {
				return {
					where: { and: [s, { deleted: false }] },
					order: "id DESC",
					limit: 500
				}
			})
			const ends = filters.map(
				filter => `/api/Messages/?filter=${JSON.stringify(filter)}`
			)
			return Promise.all(ends.map(end => this.acquireListSupplement("", end)))
				.then(() =>
					this.getFiltered(m => {
						const okSet = m.subjectType !== globals.SET || setIds.includes(m.subject)
						const okDay = m.subjectType !== globals.DAY || dayIds.includes(m.subject)
						const okDate =
							m.subjectType !== globals.DATE || dateIds.includes(m.subject)
						const okFestival =
							m.subjectType !== globals.FESTIVAL || m.subject === festivalId
						const okSeries =
							m.subjectType !== globals.SERIES || m.subject === fest.series
						const okArtist =
							m.subjectType !== globals.ARTIST || artistIds.includes(m.subject)
						return (
							okSeries &&
							okDay &&
							okDate &&
							okFestival &&
							okSeries &&
							okArtist
						)
					})
				)
				.then(baseMessages => {
					const baseFilter = {
						where: {
							and: [
								{ baseMessage: { inq: baseMessages.map(x => x.id) } },
								{ deleted: false }
							]
						}
					}
					const baseEnd = `/api/Messages/?filter=${JSON.stringify(baseFilter)}`
					return this.acquireListSupplement("", baseEnd)
				})
				.then(x => this.messageSenders())
				.catch(err => {
					console.log("this loadForFestival Promise.all")
					console.log(err)
				})
		},
		loadForArtist(artistId) {
			if (!artistId) {
				return Promise.reject("No artistId")
			}
			//console.log('loadForFestival')
			//console.log(artistId)
			const eventSubjectObject = { subjectType: globals.ARTIST, subject: artistId }
			//check if the festival has already been loaded
			const dataFieldName = "Messages"
			const end = "/api/" + dataFieldName + "/forArtist/"

			return (
				this.acquireListSupplement("", end + artistId)
					.then(x => this.messageSenders())
					//.then(() => false)
					.catch(err => {
						console.log("this loadForArtist Promise.all")
						console.error(err)
					})
			)
		}
	}
}
