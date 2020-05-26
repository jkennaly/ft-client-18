// general.js

//a subject and a message are connected if:

//message is about the subject

export default {
	messageEventConnection (e) { return m => m.subjectType === e.subjectType && 
		m.subject === e.subject
		
	}  
}