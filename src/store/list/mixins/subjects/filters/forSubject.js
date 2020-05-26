// forSubject.js

import _ from 'lodash'

export default {
	forSubject (subjectObject) { 
		return _.filter(this.list, 
			i => subjectObject.subject === i.subject && 
				subjectObject.subjectType === i.subjectType
		)
	}  
}