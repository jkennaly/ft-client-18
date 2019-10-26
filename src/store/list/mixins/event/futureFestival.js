// futureFestival.js
import _ from 'lodash'

export default (dates) => { return  {
	future (daysAhead = 0) {
		if(!this.idField) throw `No idField found for ${this.fieldName}`
		 const dateMethod = daysAhead ? 'soon' : 'future'
			const futureDates = dates[dateMethod](daysAhead)
			//console.log(futureDates.length)
			return this.getMany(_.uniq(futureDates
				.map(d => d[this.idField])))
	}
}}