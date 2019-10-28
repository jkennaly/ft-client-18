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
			const dataFieldName = 'Messages'
			const end = dataFieldName + '/forFestival/'
			if(!bulkUpdateSubjectCache[end]) bulkUpdateSubjectCache[end] = {}

			const alreadyLoaded = bulkUpdateSubjectCache[end][festivalId]
			if(alreadyLoaded) return Promise.resolve(true)
			bulkUpdateSubjectCache[end][festivalId] = true


			//get the raw data
			const bulkUpdatePromise = auth.getAccessToken()
				.then(token => m.request(reqOptionsCreate(tokenFunction(token))(end + festivalId, 'GET')()))
				.then(result => result.data)
				.catch(err => {
					bulkUpdateSubjectCache[end][festivalId] = false
					console.log('this loadForFestival bulkUpdatePromise')
					console.log(err)
				})

			//append to mem
			const memAppend = bulkUpdatePromise
				.then(this.backfillList)
				.then(result => {
					m.redraw()
					return result
				})
				.catch(err => {
					bulkUpdateSubjectCache[end][festivalId] = false
					console.log('this loadForFestival memAppend')
					console.log(err)
				})
				/*
				.then(result => {
					console.log('loadForFestival memAppend')
					console.log(this.list.length)
					return result
				})
				*/

			//append to local
			const localAppend = bulkUpdatePromise
				.then(unionLocalList('remoteData.' + dataFieldName, {updateMeta: true}))
				.catch(err => {
					bulkUpdateSubjectCache[end][festivalId] = false
					console.log('this loadForFestival localAppend')
					console.log(err)
				})

			//update local meta data
			const localMetaUpdate = bulkUpdatePromise
				//.then(logResult)
				.then(calcMeta)
				.then(meta => this.setMeta(meta))
				.catch(err => {
					bulkUpdateSubjectCache[end][festivalId] = false
					console.log('this loadForFestival localMetaUpdate')
					console.log(err)
				})

			return Promise.all([memAppend, localAppend, localMetaUpdate])
				.catch(err => {
					bulkUpdateSubjectCache[end][festivalId] = false
					console.log('this loadForFestival Promise.all')
					console.log(err)
				})

		}  
}