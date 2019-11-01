// futureDate.js
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

var dateBaseCache = {}
export default {
	active (id) {return  moment().isBetween(this.getStartMoment(id), this.getEndMoment(id))},
	ended (id) {return  moment().isAfter(this.getEndMoment(id))},
	current () {return this.list.filter(d => {
		//now is greater than the start moment but less than the end moment
		var now = moment()
		var start = this.getStartMoment(d.id)
		var end = this.getEndMoment(d.id)
		return now.isBetween(start, end, 'day')
	})},
	future () {
		const current = this.current()
			.map(d => d.id)
		return this.list
			.filter(d => current.indexOf(d.id) < 0)
			.filter(d => {
				//now is greater than now
				var now = moment()
				var start = this.getStartMoment(d.id)
				return start.isAfter(now, 'day')
			})
	},
	soon (daysAhead = 30) {
		//console.log('this soon ' + daysAhead)
		const current = this.current()
			.map(d => d.id)
		return this.list.filter(d => {
			//now is greater than the start moment but less than the end moment
			var now = moment()
			var start = this.getStartMoment(d.id)
			var end = moment().add(daysAhead, 'days')
			return start.isBetween(now, end, 'day')
		})
			.filter(d => current.indexOf(d.id) < 0)
	}
}