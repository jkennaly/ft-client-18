// intent.js

import _ from 'lodash'

import archive from '../../../loading/archive'

export default {
	clearIntent (subjectObject) { 
		const intentIds = this.list
			.filter(i => i.subject === subjectObject.subject && i.subjectType === subjectObject.subjectType)
			.map(i => i.id)

		//mark in memory
		this.list = this.list
			.filter(i => i.subject !== subjectObject.subject || i.subjectType !== subjectObject.subjectType)
		
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
		//send to server
		this.create(data)
	}  
}