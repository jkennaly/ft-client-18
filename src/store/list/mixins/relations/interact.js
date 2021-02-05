// interact.js

import _ from 'lodash'

import archive from '../../../loading/archive'
import {loadModel} from '../../../loading/enlist'

export default {
	clearInteract (subjectObject, type) { 
		const deletions = this.getFiltered(i => i.subject === subjectObject.subject && i.subjectType === subjectObject.subjectType)
			.map(x => _.set(x, 'deleted', true))
			.filter(x => x.id)
		const interactIds = deletions
			.map(i => i.id)

		//mark in memory		
		this.backfillList(deletions, true)


		//mark locally
		archive(this.fieldName, this.list)

		//send to server
		console.log('this.clearInteract', deletions)
		//console.log(subjectObject)
		//console.log(interactIds)
		//console.log(this.list)
		interactIds.map(id => this.delete({id: id}))
	},
	setInteract (subjectObject, type) { 
		const data = _.assign({}, subjectObject, {type: type})
		//mark locally
		this.list.push(data)
		loadModel(this.fieldName)
			.then(archived => _.filter(archived, data)[0])
			.then(current => {
				console.log('setInteract ')
		//send to server
				if(current && current.deleted) {
					return this.updateInstance(_.assign({}, current, {deleted: 0, timestamp: undefined}), current.id)
				}
				return this.create(data)
			})
		
			.catch(err => {
				console.error('setInteract', err)
			})
	}  
}