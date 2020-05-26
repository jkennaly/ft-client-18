// festival.js

//a set and a message are connected if:

//message is about the set
//message is sent within 24 hours of the set start

export default (messages, lineups) => {return {
	isEvent (subject) {return subject.subjectType === this.subjectType},
	messageEventConnection (e) { return m => {
		//console.log('festival messageConnections')
		if(!this.isEvent(e)) return false
		const testMessageId = m.baseMessage ? m.baseMessage : m.id
		const testMessage = testMessageId === m.id ? m : messages.get(testMessageId)
		if(!testMessage) return false
		if(testMessage.subjectType === e.subjectType && testMessage.subject === e.subject) return true
		if(testMessage.subjectType !== 2) return false
		return Boolean(lineups.find(l => l.festival === e.subject && l.band === testMessage.subject))

		
	}}  
}}