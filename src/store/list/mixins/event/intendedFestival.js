// src/store/list/mixins/event/intended.js

export default (intentions) => { return  {
	intended (daysAhead = 0) {//console.log('' + this.list.length + '-' + remoteData.Dates.list.length)
		const futures = this.future(daysAhead)
		//console.log('intended')
		//console.log(intentions.list)
		const intentFestivals = futures.filter(festival => intentions.forSubject(this.getSubjectObject(festival.id)).length)
		intentFestivals.forEach(f => this.subjectDetails({subjectType: FESTIVAL, subject: f.id}))
		return intentFestivals
	}
	
}}