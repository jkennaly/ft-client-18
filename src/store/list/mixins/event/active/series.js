// series.js
import _ from 'lodash'
import moment from 'dayjs'

export default (dates) => { return  {
	noFutureDates (waitDays = 180) {return  this.list
			.filter(s => !s.hiatus)
			.filter(s => !this.getSubDateIds(s.id, date => {
				//baseDate is after waitDays days ago
				return moment(date.basedate).isAfter(moment().subtract(waitDays, 'days'))
			}).length)},
		activeDate (id) {return  _.some(
			this.getSubDateIds(id), 
			dates.active
		)}
}}