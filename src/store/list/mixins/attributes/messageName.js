// messageName.js
import _ from 'lodash'

import {subjectDataField} from '../../../../services/subjectFunctions'

export default (subjects) => { return  {
	getName (id) { 
		const v = this.get(id)
			if(!v || !v.content) return ''
			//fromuser to touser re:subjectName
			const fromField = subjects.profiles.getName(v.fromuser)
			const toField = v.touser ? ' to ' + subjects.profiles.getName(v.touser) : ''
			//console.log('Messages getName')
			//console.log(v.subjectType)
			//console.log(v.subject)
			const subjectName = ' re: ' + subjects[subjectDataField(v.subjectType)].getName(v.subject).replace(/^ re: /, '')
			return _.truncate(subjectName)
	}  
}}