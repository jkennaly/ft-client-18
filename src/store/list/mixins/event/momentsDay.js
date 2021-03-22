// src/store/list/mixins/event/momentsDay.js
import _ from 'lodash'
import moment from 'dayjs'
var isBetween = require('dayjs/plugin/isBetween')
moment.extend(isBetween)

var dateBaseCache = {}
export default (dates) => { return  {
	getBaseMoment (id) {
		if(!id) return
			
		const day = this.get(id)
		if(!day) throw new Error('day.getBaseMoment nonexistent day ' + id)
		const superMoment = dates.getBaseMoment(this.getSuperId(id))
		//console.log(`days.getBaseMoment`, superMoment)
		return superMoment.add(day.daysOffset, 'days')
	},
	getStartMoment (id) {
		
		return this.getBaseMoment(id)
	},
	getEndMoment (id) {
		return this.getBaseMoment(id).add(1, 'days')
	},
	active (id) {
		//console.log(this, id)
		try {
			const s = this.getStartMoment(id)
			const e = this.getEndMoment(id)
			return  moment().isBetween(s, e)
		}
		catch {
			return false
		}
	}
}}