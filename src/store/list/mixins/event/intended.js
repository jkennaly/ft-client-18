// intended.js

export default (intentions) => { return  {
	intended (daysAhead = 0) {//console.log('' + this.list.length + '-' + remoteData.Dates.list.length)
		const futures = this.future(daysAhead)
		//console.log('intended')
		//console.log(intentions.list)
		return futures.filter(festival => intentions.forSubject(this.getSubjectObject(festival.id)))
	}
	
}}