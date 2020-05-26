// event.js

//a set and a message are connected if:

//message is about the set
//message is sent within 24 hours of the set start

export default {
	isEvent (subject) {return subject.subjectType === this.subjectType},
	messageEventConnection (e) { return m => this.isEvent(m) && 
		this.isEvent(e) && 
		m.subject === e.subject
		
	}  
}