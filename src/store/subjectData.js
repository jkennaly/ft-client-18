// subjectData.js

import _ from 'lodash'

import {remoteData} from './data.js'


const subjectDataField = type => {return {
	'10': 'Messages',
	'6': 'Series',
	'7': 'Festivals',
	'8': 'Dates',
	'9': 'Days',
	'3': 'Sets',
	'5': 'Venues',
	'4': 'Places',
	'2': 'Artists',
	'1': 'Users'
}[type]}

const getRating = (sub, type, author) => {
	const mType = 2
	const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
	const subRating = authorRatings.filter(m => m.subject === sub)

	const message = subRating[0]
	return message
}

const getComment = (sub, type, author) => {
	const mType = 1
	const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
	const subRating = authorRatings.filter(m => m.subject === sub)

	const message = subRating[0]
	return message
}

export const subjectData = {
	name: (sub, type) => type && sub ? remoteData[subjectDataField(type)].getName(sub) : '',
	data: ({subject, subjectType}) => subjectType && subject ? remoteData[subjectDataField(subjectType)].get(subject) : '',
	ratingBy: (sub, type, author) => {
		//console.log('subjectData ratingBy sub: ' + sub + 'type: ' + type + 'author: ' + author)
		const message = getRating(sub, type, author)
		const rate = message && message.content ? parseInt(message.content, 10) : 0
		return rate
	},
	ratingId: (sub, type, author) => {
		const message = getRating(sub, type, author)
		const id = message && message.id
		return id
	},
	commentBy: (sub, type, author) => {
		const message = getComment(sub, type, author)
		const comment = message && message.content ? message.content : ''
		//console.log('subjectData authorRatings ' + authorRatings.length)
		//console.log('subjectData aboutArtists ' + aboutArtists.length)
		//console.log('subjectData ratings ' + ratings.length)
		//console.log('subjectData byAuthor ' + byAuthor.length)
		//console.log('subjectData byAuthor add ' + (author + 1))
		//console.log('subjectData byFromuser add ' + (remoteData.Messages.list[0].fromuser + 1))
		//console.log('subjectData subRating ' + subRating.length)
		return comment
	},
	commentId: (sub, type, author) => {
		const message = getComment(sub, type, author)
		const id = message && message.id
		return id
	},
	imagePreset: type => 'artist',
	connectedData: subjectObject => {
		//get non-event data needed to display a detail view of the subject

		//first check if bulk data on subject has already been collected:


		//festival detail:
		//nonmessages:
		//artists in the lineup

		//messages with subjects:
		//event
		//all superEvents
		//all subEvents
		//all artists in lineup
		//future: all places for festival
	},
	
}