// src/store/list/mixins/event/intended.js
import globals from "../../../../services/globals"

export default (intentions, dates) => {
	return {

		intended(daysAhead = 0, opts = { skipDetails: false }) {//console.log('' + this.list.length + '-' + remoteData.Dates.list.length)

			const futures = this.future(daysAhead)
			//console.log('intended')
			//console.log(intentions.list)
			const intentFestivals = futures.filter(festival => {
				const direct = intentions.getFiltered(this.getSubjectObject(festival.id)).length
				if (direct) return true
				const unendedDates = this.getSubDateIds(festival.id).filter(did => !dates.ended(did))
				if (!unendedDates.length) return false
				return !!intentions.getFiltered(i => i.subjectType === globals.DATE && unendedDates.includes(i.subject)).length
			}

			)

			if (!opts.skipDetails) intentFestivals.forEach(f => this.subjectDetails({ subjectType: globals.FESTIVAL, subject: f.id }))

			return intentFestivals
		}

	}
}