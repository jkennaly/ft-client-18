// rated.js

export default (messages) => { return  {
	getRating (id, userId) {
		const ratings = messages.getFiltered({subjectType: this.subjectType, subject: this.id})
			.filter(m => m.messageType === 2)
			.filter(m => !userId || m.fromuser === userId)
			.sort(timeStampSort)
		const ratingContent = ratings.length ? ratings[0].content : '0'
		const intValue = parseInt(ratingContent, 10)
		//console.log('data.js remoteData.Artists.getRating ratings.length ' + ratings.length )
		//console.log('data.js remoteData.Artists.getRating intValue ' + intValue )
		return intValue
	}}  
}