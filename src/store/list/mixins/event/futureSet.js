// futureSet.js
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
		return now.isBetween(start, end, 'minute')
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
				return start.isAfter(now, 'minute')
			})
	},
	soon (minutesAhead = 30) {
		//console.log('this soon ' + minutesAhead)
		const current = this.current()
			.map(d => d.id)
		return this.list.filter(d => {
			//now is greater than the start moment but less than the end moment
			var now = moment()
			var start = this.getStartMoment(d.id)
			var end = moment().add(minutesAhead, 'minutes')
			return start.isBetween(now, end, 'minute')
		})
			.filter(d => current.indexOf(d.id) < 0)
	}
}