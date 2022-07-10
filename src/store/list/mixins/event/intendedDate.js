// src/store/list/mixins/event/intendedDate.js
import globals from "../../../../services/globals"

export default (intentions) => {
	return {
		intended() {//console.log('' + this.list.length + '-' + remoteData.Dates.list.length)

			//console.log('intended')
			//console.log(intentions.list)
			const intentDates = this.current()
				.filter(date => intentions.some(i => i.subjectType === globals.DATE && i.subject === date.id || i.subjectType === globals.FESTIVAL && i.subject === date.id))

			intentDates.forEach(f => this.subjectDetails({ subjectType: globals.DATE, subject: f.id }))
			return intentDates
		}

	}
}