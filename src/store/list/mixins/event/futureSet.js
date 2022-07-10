// src/store/list/mixins/event/futureSet.js
import _ from 'lodash'
import moment from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
moment.extend(isBetween)

var dateBaseCache = {}
export default {
	active(id) {
		try {
			const s = this.getStartMoment(id)
			const e = this.getEndMoment(id)
			//console.log(this.fieldName + 'active ok', id, moment().isBetween(s, e))
			return moment().isBetween(s, e)
		}
		catch {
			//console.log(this.fieldName + 'active bad', id)
			return false
		}
	},
	ended(id) {
		try {
			var now = moment()
			const e = this.getEndMoment(id)
			return now.isAfter(e, 'minute')
		}
		catch {
			return false
		}
	},
	current() {
		return this.list.filter(d => {
			//now is greater than the start moment but less than the end moment
			try {
				const s = this.getStartMoment(d.id)
				const e = this.getEndMoment(d.id)
				return moment().isBetween(s, e, 'minute')
			}
			catch {
				return false
			}
		})
	},
	future(dayId) {
		return this.getFiltered(d => {
			if (dayId && dayId !== d.day) return false
			try {
				var now = moment()
				const s = this.getStartMoment(d.id)
				return s.isAfter(now, 'minute')
			}
			catch {
				return false
			}
		})
	},
	soon(minutesAhead = 30) {
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