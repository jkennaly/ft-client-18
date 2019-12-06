// src/store/list/mixins/event/futureSet.js
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

var dateBaseCache = {}
export default {
	active (id) {
		try {
			const s = this.getStartMoment(id)
			const e = this.getEndMoment(id)
		console.log(this.fieldName + 'active ok', id, moment().isBetween(s, e))
			return  moment().isBetween(s, e)
		}
		catch {
		console.log(this.fieldName + 'active bad', id)
			return false
		}
	},
	ended (id) {
		try {
				var now = moment()
			const e = this.getEndMoment(id)
			return  now.isAfter(e, 'minute')
		}
		catch {
			return false
		}
		},
	current () {return this.list.filter(d => {
		//now is greater than the start moment but less than the end moment
		try {
			const s = this.getStartMoment(id)
			const e = this.getEndMoment(id)
			return  moment().isBetween(s, e, 'minute')
		}
		catch {
			return false
		}
	})},
	future () {
		const current = this.current()
			.map(d => d.id)
		return this.list
			.filter(d => current.indexOf(d.id) < 0)
			.filter(d => {
		try {
				var now = moment()
			const s = this.getStartMoment(id)
			return  s.isAfter(now, 'minute')
		}
		catch {
			return false
		}
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