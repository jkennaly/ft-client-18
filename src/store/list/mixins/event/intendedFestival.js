// src/store/list/mixins/event/intended.js

export default (intentions, dates) => { return  {
	intended (daysAhead = 0, opts = {noUpdate: false}) {//console.log('' + this.list.length + '-' + remoteData.Dates.list.length)
		const futures = this.future(daysAhead)
		//console.log('intended')
		//console.log(intentions.list)
		const intentFestivals = futures.filter(festival => {
			const direct = intentions.getFiltered(this.getSubjectObject(festival.id)).length
			if(direct) return true
			const unendedDates = this.getSubDateIds(festival.id).filter(did => !dates.ended(did))
			if(!unendedDates.length) return false
			return !!intentions.getFiltered(i => i.subjectType === DATE && unendedDates.includes(i.subject)).length
		}
			
		)
		if(!opts.noUpdate) intentFestivals.forEach(f => this.subjectDetails({subjectType: FESTIVAL, subject: f.id}))
		return intentFestivals
	}
	
}}