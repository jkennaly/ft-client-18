// src/store/list/mixins/event/sellAccess.js


const FLAG = 13
const IMAGE = 12
const FESTIGRAM = 11
const MESSAGE = 10
const DAY = 9
const DATE = 8
const FESTIVAL = 7
const SERIES = 6
const VENUE = 5
const PLACE = 4
const SET = 3
const ARTIST = 2
const USER = 1

const alwaysAccessibleSubjects = [
	FLAG,
	IMAGE,
	FESTIGRAM,
	SERIES,
	VENUE,
	PLACE,
	ARTIST,
	USER,
	MESSAGE
]
var gttFields = {}
gttFields[SET] = 'sets'
gttFields[DAY] = 'days'
gttFields[DATE] = 'dates'
gttFields[FESTIVAL] = 'festivals'
export const subjectBought = (subjectObject) => (gtt) => {
	//if the subject is not restricted by gtt, retrun true
	if (alwaysAccessibleSubjects.includes(subjectObject.subjectType)) return true
	if (!gtt) return false
	//if user has full access, retrun true
	if (gtt.full && gtt.exp > (Date.now() / 1000)) return true
	const gttField = gttFields[subjectObject.subjectType]
	//if no gtt field, the subjectTypew is not restricted
	if (!gttField) return true
	if (!gtt[gttField]) {
		//console.error('No field found', gtt, gttField)
		return false
	}
	const bought = gtt[gttField].includes(subjectObject.subject)
	return bought

}

export default (subList) => {
	return {
		sellAccess(id, decoded) {
			if (!this.subjectType) return false
			const so = {
				subjectType: this.subjectType,
				subject: id
			}
			const bought = subjectBought(so)(decoded)
			const endMoment = bought || this.getEndMoment(id)
			const nonsellable = bought || endMoment && endMoment.valueOf() < Date.now()
			//console.log(this.fieldName, 'sellAccess', nonsellable, id)
			if (!subList || !subList.sellAccess || nonsellable) return !nonsellable
			const subs = this.getSubIds(id)


			return subs
				.reduce((sellable, sid) => sellable && subList.sellAccess(sid, decoded), true)
		}
	}
}