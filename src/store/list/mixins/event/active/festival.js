// src/store/list/mixins/event/active/festival.js

import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

export default (dates) => { return  {
	eventActive (id) {return this.get(id) && (parseInt(this.get(id).year, 10) >= (new Date().getFullYear()))},
	getStartMoment (id) {
		const dateIds = this.getSubDateIds(id)
		if(!dateIds.length) return undefined
		const startInts = dateIds.map(dates.getStartMoment)
			.map(m => m.valueOf())
			.filter(_.isNumber)
			.sort((a, b) => a - b)
		if(!startInts.length) return undefined

		return moment(startInts[0])
	},
	getEndMoment (id) {
		const dateIds = this.getSubDateIds(id)
		if(!dateIds.length) return undefined
		const endInts = dateIds.map(id => dates.getEndMoment(id))
			.map(m => m.valueOf())
			.filter(_.isNumber)
			.sort((a, b) => b - a)
		if(!endInts.length) return undefined

		return moment(endInts[0])
	},
	active (id) {
		//console.log(this, id)
		try {
			const s = this.getStartMoment(id)
			const e = this.getEndMoment(id)
			return  moment().isBetween(s, e, 'day')
		}
		catch {
			return false
		}
	},
	activeDate (id) {return  _.some(
		this.getSubDateIds(id), 
		dates.active
	)},
	future (daysAhead = 0) {
		return this.getFiltered(f => moment().add(daysAhead, 'days').isBefore(this.getEndMoment(f.id)))
	},
}}