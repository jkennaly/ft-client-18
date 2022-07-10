// src/store/list/mixins/event/momentsDate.js
import _ from 'lodash'
import moment from 'dayjs'
import utc from 'dayjs/plugin/utc' // dependent on utc plugin
import timezone from 'dayjs/plugin/timezone'
moment.extend(utc)
moment.extend(timezone)
var dateBaseCache = {}
export default (days, venues) => {
	return {
		getBaseMoment(id) {
			const cached = _.get(dateBaseCache, 'base.' + id)
			//if(cached) console.log('Dates.getBaseMoment cached+zone',cached)
			if (cached) return moment(cached)
			const date = this.get(id)
			if (!date) throw new Error('this.getBaseMoment nonexistent date ' + id)
			//console.log('venues list ' + venues.list.length)
			const timezone = venues.getTimezone(date.venue)
			//console.log('Dates.getBaseMoment timezone',timezone)
			const momentString = date.basedate.match(/(\d{2,4}-\d{1,2}-\d{1,2})T/)[1] + ' 10:00'
			const momentFormat = 'Y-M-D H:mm'
			if (!timezone) return moment(momentString)
			const m = moment.tz(momentString, timezone)
			_.set(dateBaseCache, 'base.' + id, m.valueOf())
			return moment(m)
		},
		getStartMoment(id) {
			const cached = _.get(dateBaseCache, 'start.' + id)
			if (cached) return moment(cached)
			const m = moment(this.getBaseMoment(id)).subtract(1, 'days')
			_.set(dateBaseCache, 'start.' + id, m.valueOf())
			return moment(m)
		},
		getEndMoment(id) {
			const cached = _.get(dateBaseCache, 'end.' + id)
			if (cached) return moment(cached)
			const days = this.getSubDayIds(id)
			const m = moment(this.getStartMoment(id)).add(days.length + 2, 'days')
			_.set(dateBaseCache, 'end.' + id, m.valueOf())
			return moment(m)
		},
		activeDay(id) {
			return this.getSubDayIds(id).find(id => days.active(id))
		},
		_cache_clear_moments_date() {
			dateBaseCache = {}
		}
	}
}