// subjectFunctions.js

import _ from 'lodash'

 const subjectType = {
	MESSAGE: 10,
	SERIES: 6,
	FESTIVAL: 7,
	DATE: 8,
	DAY: 9,
	SET: 3,
	VENUE: 5,
	PLACE: 4,
	ARTIST: 2,
	USER: 1
}

export const sameSubject = (sub1, sub2) => sub1 && sub2 && sub1.subject && sub1.subjectType && sub1.subject === sub2.subject && sub1.subjectType === sub2.subjectType
export const so = typeString => {
	const baseObject = {subjectType: subjectType[typeString]}
	return ({id}) => _.assign({}, baseObject, {subject: id})

}


