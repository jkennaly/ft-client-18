// src/store/list/mixins/remote/festivalMessages.js


import _ from 'lodash'
var bulkUpdateSubjectCache = {}

export default {
	loadForFestival (festivalId) {
			if(!festivalId) {
				return Promise.reject('No festivalId')
			}
			//console.log('loadForFestival', festivalId)
			//console.log(festivalId)
			const eventSubjectObject = {subjectType: FESTIVAL, subject: festivalId}
			//check if the festival has already been loaded
			const dataFieldName = '/api/' + 'Messages'
			const end = dataFieldName + '/forFestival/'
			return this.acquireListSupplement('', end + festivalId)
				.catch(err => {
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
			const eventSubjectObject = {subjectType: ARTIST, subject: artistId}
			//check if the festival has already been loaded
			const dataFieldName = 'Messages'
			const end = '/api/' + dataFieldName + '/forArtist/'

			return this.acquireListSupplement('', end + artistId)
				//.then(() => false)
				.catch(err => {
					console.log('this loadForArtist Promise.all')
					console.error(err)
				})
		}
}