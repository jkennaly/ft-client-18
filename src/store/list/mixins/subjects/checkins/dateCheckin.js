// dateCheckin.js


export default (messages) => { return  {
	checkedIn (userId) {return this.current()
			.filter(date => messages.getFiltered({subject: date.id, subjectType: 8, messageType: 3, fromuser: userId}).length)
		
}}}