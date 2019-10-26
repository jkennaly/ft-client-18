// subjective.js

export default {
	getSubjectObject (id) { 
		if(!this.subjectType) throw `No subjectType for subjectObject creation ${this.fieldName}`
		return {subjectType: this.subjectType, subject: id}
	}  
}