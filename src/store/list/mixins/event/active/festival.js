// src/store/list/mixins/event/active/festival.js

import _ from 'lodash'
import moment from 'dayjs'

var isBetween = require('dayjs/plugin/isBetween')
moment.extend(isBetween)
export default (dates) => { return  {
	getStartMoment (id) {
		const dateIds = this.getSubDateIds(id)
		//console.log('festival getStartMoment dateIds', id, dateIds)
		if(!dateIds.length) {
			const fest = this.get(id)
			if(!fest) return undefined
			return moment(fest.year, 'YYYY')
		}
		const startInts = dateIds.map(id => dates.getStartMoment(id))
			.map(m => m.valueOf())
			.filter(_.isNumber)
			.sort((a, b) => a - b)
		if(!startInts.length) return undefined

		return moment(startInts[0])
	},
	getEndMoment (id) {
		const dateIds = this.getSubDateIds(id)
		if(!dateIds.length) {
			const fest = this.get(id)
			if(!fest) return undefined
			return moment(fest.year, 'YYYY')
		}
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
			//console.log('festival active', id, s, e)
			return  moment().isBetween(s, e, 'day')
		}
		catch {
			return false
		}
	},
	activeDate (id) {return  this.getSubDateIds(id).some(did => dates.active(did))},
	future (daysAhead = 0) {
		return this.getFiltered(f => {
			const end = this.getEndMoment(f.id)
			if(!end) return false
			return moment().add(daysAhead, 'days').isBefore(end)

		})
	},
}}