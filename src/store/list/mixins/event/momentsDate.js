// momentsDate.js
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

var dateBaseCache = {}
export default (venues) => { return  {
	getBaseMoment (id) {
		const cached = _.get(dateBaseCache, 'base.' + id)
		const cachedZone = _.get(dateBaseCache, 'base.zone.' + id)
		//if(cached) console.log('Dates.getBaseMoment cached+zone',cached, cachedZone)
		if(cached) return moment.tz(cached, cachedZone)
		const date = this.get(id)
		if(!date) throw 'this.getBaseMoment nonexistent date ' + id
		const timezone = venues.getTimezone(date.venue)
		//console.log('Dates.getBaseMoment timezone',timezone)
		const momentString = date.basedate + ' 10:00'
		const momentFormat = 'Y-M-D H:mm'
		const m = moment.tz(momentString, momentFormat, timezone)
		if(!timezone) return moment(m)
		_.set(dateBaseCache, 'base.' + id, m.valueOf())
		_.set(dateBaseCache, 'base.zone.' + id, timezone)
		return moment(m)
	},
	getStartMoment (id) {
		const cached = _.get(dateBaseCache, 'start.' + id)
		if(cached) return moment(cached)
		const m = moment(this.getBaseMoment(id)).subtract(1, 'days')
		_.set(dateBaseCache, 'start.' + id, m.valueOf())
		return moment(m)
	},
	getEndMoment (id) {
		const cached = _.get(dateBaseCache, 'end.' + id)
		if(cached) return moment(cached)
		const days = this.getSubDayIds(id)
		const m = moment(this.getStartMoment(id)).add(days.length + 2, 'days')
		_.set(dateBaseCache, 'end.' + id, m.valueOf())
		return moment(m)
	}
}}