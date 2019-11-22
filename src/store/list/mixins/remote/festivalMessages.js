// festivalMessages.js


import _ from 'lodash'
var bulkUpdateSubjectCache = {}

export default {
	loadForFestival (festivalId) {
			if(!festivalId) {
				return Promise.reject('No festivalId')
			}
			//console.log('loadForFestival')
			//console.log(festivalId)
			const eventSubjectObject = {subjectType: 7, subject: festivalId}
			//check if the festival has already been loaded
			const dataFieldName = '/api/' + 'Messages'
			const end = dataFieldName + '/forFestival/'
			if(!bulkUpdateSubjectCache[end]) bulkUpdateSubjectCache[end] = {}

			const alreadyLoaded = bulkUpdateSubjectCache[end][festivalId]
			if(alreadyLoaded) return Promise.resolve(true)
			bulkUpdateSubjectCache[end][festivalId] = true


			return this.acquireListUpdate('', end + festivalId)
				.catch(err => {
					bulkUpdateSubjectCache[end][festivalId] = false
					console.log('this loadForFestival Promise.all')
					console.log(err)
				})

		},
		loadForArtist (artistId) {
			if(!artistId) {
				return Promise.reject('No artistId')
			}
			//console.log('loadForFestival')
			//console.log(artistId)
			const eventSubjectObject = {subjectType: 2, subject: artistId}
			//check if the festival has already been loaded
			const dataFieldName = 'Messages'
			const end = '/api/' + dataFieldName + '/forArtist/'
			if(!bulkUpdateSubjectCache[end]) bulkUpdateSubjectCache[end] = {}

			const alreadyLoaded = bulkUpdateSubjectCache[end][artistId]
			if(alreadyLoaded) return Promise.resolve(true)
			bulkUpdateSubjectCache[end][artistId] = true


			return this.acquireListUpdate('', end + artistId)
				.then(() => false)
				.catch(err => {
					bulkUpdateSubjectCache[end][artistId] = false
					console.log('this loadForArtist Promise.all')
					console.error(err)
				})

		}
}