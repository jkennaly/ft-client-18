// dateCheckin.js


export default (messages) => { return {
	checkedIn (userId) {return this.current()
			.filter(date => messages.implicit({subjectType: this.subjectType, subject: date.id}, userId))
		
}}}