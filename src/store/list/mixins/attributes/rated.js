// rated.js

import {timeStampSort} from '../../../../services/sorts.js'
import _ from 'lodash'

export default (messages) => { return  {
	getRating (id, userId) {
		const ratings = messages.getFiltered({subjectType: this.subjectType, subject: id, messageType: 2})
			.filter(m => !userId || m.fromuser === userId)
			.sort(timeStampSort)
			.map(m => m.content)
			.map(c => parseInt(c, 10))
		const ratingContent = userId ? _.first(ratings) : Math.floor(ratings.reduce((pv, cv, i, ar) => pv + cv / ar.length, 0))
		//console.log('data.js remoteData.Artists.getRating ratings.length ' + ratings.length )
		//console.log('data.js remoteData.Artists.getRating intValue ' + intValue )
		return ratingContent
	}}  
}