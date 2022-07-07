// src/store/list/mixins/remote/details/message.js



import _ from 'lodash'

import { subjectDataField } from '../../../../../services/subjectFunctions'


export default (subjects) => {
	return {
		subjectDetails(so) {
			if (!so || !so.subjectType || !so.subject) {
				return Promise.reject('No subject object for subjectDetails')
			}
			if (so.subjectType !== this.subjectType) return Promise.reject(`No flag subjectType mismatch ${so.subjectType} !== ${this.subjectType}`)

			//console.log('subjectDetails', so)
			//get subjectData from the model, loading from the server if needed
			//for each subject Type, collect detail information

			//assumes all series loaded from core
			//assumes all festivals are loaded from core

			var updated = false

			return this.getLocalPromise(so.subject)
				.then(([subjectData, upd]) => {
					updated = updated || upd
					return subjectData
				})
				.then(subjectData => {
					//get to the baseMessage
					//console.log('message subjectDetails', so, subjectData)
					const userP = subjects.profiles.getLocalPromise(subjectData.fromuser)
					if (subjectData.subjectType !== MESSAGE) return subjectData
					if (!subjectData.baseMessage) throw new Error(`expected baseMessage: ${subjectData}`)
					return this.getLocalPromise(subjectData.baseMessage)
						.then(([subjectData, upd]) => subjectData)
				})
				.then(baseMessage => {
					const typeString = subjectDataField(baseMessage.subjectType).toLowerCase()
					//console.log('subjects.Messages.eventConnectedFilter cachePath')
					//console.log(typeString)
					//console.log(cachePath)
					const discuss = this.getFiltered({ baseMessage: baseMessage.id })
						.map(x => x.id)

					const messQuery = `filter=` + JSON.stringify({
						where: {
							and: [
								{ baseMessage: baseMessage.id },
								{ id: { nin: discuss } }
							]
						}
					})
					//console.log('subjectDetails typeString', typeString)
					return Promise.all([
						subjects[typeString].subjectDetails(baseMessage),
						this.acquireListSupplement(messQuery)
							.then(upd => updated = updated || upd)
					])
				})
				.then(() => updated)

				.catch(err => {
					console.log('this subjectDetails flag')
					console.log(err)
				})


		}
	}
}