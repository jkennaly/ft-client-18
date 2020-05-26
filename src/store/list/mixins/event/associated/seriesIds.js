// seriesIds.js
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

export default ({festivals, dates, days, sets}) => { return  {
	getSubFestivalIds (id) { 
		return festivals.getFiltered(s => s.series === id).map(s => s.id)
	},
	getSubDateIds (id, filter = x => x) {
		const festivals = this.getSubFestivalIds(id)
		return dates.list.filter(s => festivals.indexOf(s.festival) > -1)
			.filter(filter)
			.map(s => s.id)
	},
	getSubDayIds (id) {
		const dates = this.getSubDateIds(id)
		return days.list.filter(s => dates.indexOf(s.date) > -1).map(s => s.id)
	},
	getSubSetIds (id) {
		const days = this.getSubDayIds(id)
		return sets.list.filter(s => days.indexOf(s.day) > -1).map(s => s.id)
	},
	getVenueIds (id) {
		return dates.getMany(
			this.getSubDateIds(id)
		)
		.sort((a, b) => {
			const am = moment(a.baseDate).utc()
			const bm = moment(b.baseDate).utc()
			return am.diff(bm)
		})
		.map(date => date.venue)
	}
}}