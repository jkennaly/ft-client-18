// festivalIds.js
import _ from 'lodash'

export default ({series, dates, days, sets}) => { return  {
	getSeriesId (id) { 
		const fest = _.find(this.list, p => p.id === id)
			if(!fest) return
			return fest.series
	},
	getSubDateIds (id, filter = x => x) {
		return dates.list.filter(s => s.festival === id).map(s => s.id).filter(filter)
	},
	getSubDayIds (id) {
		const dates = this.getSubDateIds(id)
			return days.list.filter(s => dates.indexOf(s.date) > -1).map(s => s.id)
	},
	getSubSetIds (id) {
		const days = this.getSubDayIds(id)
			return sets.list.filter(s => days.indexOf(s.day) > -1).map(s => s.id)
	},
	getPeerIds (id) {
		return series.getSubIds(this.getSuperId(id))
			.filter(x => x !== id)
	}
}}