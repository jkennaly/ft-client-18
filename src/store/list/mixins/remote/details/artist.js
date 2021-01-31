// src/store/list/mixins/remote/details/artist.js



import _ from 'lodash'

export default ({artists, dates, sets, messages}, lineups, images, artistAliases, genres, artistGenres, parentGenres, artistPriorities) => { return {
	subjectDetails (so) {
		if(!so || !so.subjectType || !so.subject) {
			return Promise.reject('No subject object for subjectDetails')
		}
		if(so.subjectType !== this.subjectType) return Promise.reject(`No artist subjectType mismatch ${so.subjectType} !== ${this.subjectType}` )


		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		//assumes all series loaded from core
		//assumes all festivals are loaded from core

		var updated = false

		const setIdsPresent = sets.getFiltered(s => s.band === so.subject)
			.map(s => s.id)
		return this.getLocalPromise(so.subject)
			.then(([subjectData, upd]) => {
				updated = updated || upd
				return subjectData
			})
			.then(subjectData => {
				//lineups
				const lineEnd = `/api/Lineups`
				const lineQuery = `filter[where][band]=${so.subject}`
				//images
				const imgEnd = `/api/Images`
				const imgQuery = `filter=` + JSON.stringify({where: {and: [
					{subject: so.subject},
					{subjectType: so.subjectType}
				]}})
				//sets
				const setEnd = `/api/Sets`
				const setQuery = `filter=` + JSON.stringify({where: {and: [
					{id: {nin: setIdsPresent}},
					{band: so.subject},
				]}})
				//direct messages
				const messEnd = `/api/Messages`
				const messQuery = `filter=` + JSON.stringify({where: {and: [
					{subject: so.subject},
					{subjectType: so.subjectType}
				]}})
				return Promise.all([
					lineups.acquireListSupplement(lineQuery, lineEnd)
						.then(upd => updated = updated || upd),
					images.acquireListSupplement(imgQuery, imgEnd)
						.then(upd => updated = updated || upd),
					sets.acquireListSupplement(setQuery, setEnd)
						.then(upd => updated = updated || upd)
						.then(() => {
							//set messages

							const setIdsPresent = sets.getFiltered(s => s.band === so.subject)
								.map(s => s.id)

							const messQuery = `filter=` + JSON.stringify({where: {and: [
								{subject: {inq: setIdsPresent}},
								{subjectType: sets.subjectType}
							]}})
							return messages.acquireListSupplement(messQuery, messEnd)
						})
						.then(upd => updated = updated || upd),
					messages.acquireListSupplement(messQuery, messEnd)
						.then(upd => updated = updated || upd)
				])

			})
			.then(() => updated)
			
			.catch(err => {
				console.log('this subjectDetails artist')
				console.log(err)
			})

	},
	secDataPromise () {

		//get subjectData from the model, loading from the server if needed
		//for each subject Type, collect detail information

		//assumes all series loaded from core
		//assumes all festivals are loaded from core


		return Promise.all([
			images.remoteCheck(),
			artistAliases.remoteCheck(),
			artistGenres.remoteCheck(),
			parentGenres.remoteCheck(),
			genres.remoteCheck(),
			artistPriorities.remoteCheck()

		])
		.then(() => true)
		
		.catch(err => {
			console.log('this subjectDetails Promise.all')
			console.log(err)
		})

	}
}}