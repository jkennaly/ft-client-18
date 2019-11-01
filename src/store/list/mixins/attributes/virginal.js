// virginal.js
import _ from 'lodash'

import {futurePrioritySort} from '../../../../services/sorts.js'

export default (messages, festivals, lineups) => { return  {
	virgins () {
		const futures = festivals.future()
		return this.list
			.filter(ar => !messages.getFiltered({subjectType: 2, subject: ar.id}).length)
			.sort(futurePrioritySort(futures, lineups))
	}}  
}