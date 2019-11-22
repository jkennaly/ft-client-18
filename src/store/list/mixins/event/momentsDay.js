// momentsDay.js
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

var dateBaseCache = {}
export default (dates) => { return  {
	getBaseMoment (id) {
		if(!id) return
			
		const day = this.get(id)
		if(!day) throw new Error('day.getBaseMoment nonexistent day ' + id)
		const superMoment = dates.getBaseMoment(this.getSuperId(id))

		return moment(superMoment.add(this.get(id).daysOffset, 'days'))
	},
	getStartMoment (id) {
		
		return this.getBaseMoment(id)
	},
	getEndMoment (id) {
		return this.getBaseMoment(id).add(1, 'days')
	}
}}