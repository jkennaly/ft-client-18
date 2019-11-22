// intent.js

import _ from 'lodash'

import archive from '../../../loading/archive'
import {loadModel} from '../../../loading/enlist'

export default {
	clearIntent (subjectObject) { 
		const deletions = this.getFiltered(i => i.subject === subjectObject.subject && i.subjectType === subjectObject.subjectType)
			.map(x => _.set(x, 'deleted', true))
		const intentIds = deletions
			.map(i => i.id)

		//mark in memory		
		this.backfillList(deletions, true)


		//mark locally
		archive(this.fieldName, this.list)

		//send to server
		//console.log('this.clearIntent')
		//console.log(subjectObject)
		//console.log(intentIds)
		//console.log(this.list)
		this.batchDelete(intentIds)
	},
	setIntent (subjectObject) { 
		const data = subjectObject
		//mark locally
		this.list.push(data)
		loadModel(this.fieldName)
			.then(archived => _.filter(archived, data)[0])
			.then(current => {
				console.log('setIntent ')
		//send to server
				if(current && current.deleted) {
					return this.updateInstance(_.assign({}, current, {deleted: 0, timestamp: undefined}), current.id)
				}
				return this.create(data)
			})
		
			.catch(err => {
				console.error('setIntent', err)
			})
	}  
}