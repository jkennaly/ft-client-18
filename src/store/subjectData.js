// subjectData.js

import _ from 'lodash'

import {remoteData} from './data.js'
import {reviewArrays} from '../services/reviewArrays'
import {reqOptionsCreate, tokenFunction} from '../services/requests.js'
import {timeStampSort} from '../services/sorts.js'
import Auth from '../services/auth.js'
const auth = new Auth()

const subjectDataField = type => {return {
	'10': 'Messages',
	'9': 'Days',
	'8': 'Dates',
	'7': 'Festivals',
	'6': 'Series',
	'5': 'Venues',
	'4': 'Places',
	'3': 'Sets',
	'2': 'Artists',
	'1': 'Users'
}[type]}

const secondarySubjectObjects = type => {return {
	//Messages
	'10': so => [],
	//Days
	'9': so => [],
	//Dates
	'8': so => [],
	//Festivals
	'7': so => [],
	//Series
	'6': so => [],
	//Venues
	'5': so => [],
	//Places
	'4': so => [],
	//Sets
	'3': so => {
		const theSet = remoteData.Sets.get(so.subject)
		//console.log('subjectData secondarySubjectObjects for ', so, theSet)
		if(theSet && theSet.band) return [{subject: theSet.band, subjectType: 2}]
		return []
		
	
	},
	//Artists
	'2': so => remoteData.Sets.forArtist(so.subject)
		.map(s => s.id)
		.map(id => {return {subject: id, subjectType: 3}}),
	//Users
	'1': so => []
}[type]}

const getRating = (sub, type, author) => {
	const mType = 2
	const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
	const subRating = authorRatings.filter(m => m.subject === sub)
		.sort(timeStampSort)

	const message = subRating[0]
	return message
}

const getRatingAverage = ({subject, subjectType}) => {
	//get each user with a rating
	const allPrimaryRaters = _.uniq(remoteData.Messages.getFiltered({
		subject: subject,
		subjectType: subjectType,
		messageType: 2
	}).map(m => parseInt(m.fromuser, 10)))
	//get the rating from each user
	const allRatings = allPrimaryRaters.map(author => getRating(subject, subjectType, author))
	//average each users rating
	const average = allRatings.reduce((acc, r, i, arr) => acc + r / arr.length, 0)
	return average
}

const getComment = (sub, type, author) => {
	const mType = 1
	const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
	const subRating = authorRatings.filter(m => m.subject === sub)

	const message = subRating[0]
	return message
}

const ts = () => Math.round((new Date()).getTime() / 1000)
const eventActive = primaryField => subjectObject => [
	//invalid
	x => false,
	//user
	x => false,
	//artist
	x => false,
	//set
	primaryField.active,
	//place
	x => true,
	//venue
	x => true,
	//series
	primaryField.activeDate,
	//festival
	primaryField.activeDate,
	//date
	primaryField.active,
	//day
	primaryField.active,
	//message
	x => false
][subjectObject.subjectType](subjectObject.subject)

var subjectLoaded = {}

export const subjectData = {
	MESSAGE: 10,
	SERIES: 6,
	FESTIVAL: 7,
	DATE: 8,
	DAY: 9,
	SET: 3,
	VENUE: 5,
	PLACE: 4,
	ARTIST: 2,
	USER: 1,
	get: (subjectObject) => remoteData[subjectDataField(subjectObject.subjectType)]
			.get(subjectObject.subject),
	getManySingleType: (subjectObjectAr) => {
		if(!subjectObjectAr || !subjectObjectAr.length) return []
		return remoteData[subjectDataField(subjectObjectAr[0].subjectType)]
			.getMany(subjectObjectAr.map(so => so.subject))
	},
	name: (sub, type) => {
		if(!sub) return
		const suba = !sub.subject ? sub : sub.subject
		const typea = !sub.subjectType ? type : sub.subjectType
		return typea && suba ? remoteData[subjectDataField(typea)].getName(suba) : ''

	},
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
	active: subjectObject => subjectObject && subjectObject.subject && eventActive(remoteData[subjectDataField(subjectObject.subjectType)])(subjectObject),
	checkIn: subjectObject => {
		const primaryField = remoteData[subjectDataField(subjectObject.subjectType)]
		if(eventActive(primaryField)(subjectObject)) {
			remoteData.Messages.create({
		        //fromuser: attrs.user,
		        subject: subjectObject.subject,
		        subjectType: subjectObject.subjectType,
		        messageType: 3,
		        content: 0
		    })
		}},
	checkedIn: (subjectObject, options = {}) => {
		//console.log('subjectData checkedIn', subjectObject, options)
		if(!subjectObject || !subjectObject.subject) return false
		const subjectObjectSpecsUser = subjectObject.subjectType === subjectData.USER
		//with options.date and subjectObject specifies a user
			//if there is an active date associated with the user return the id
		if(subjectObjectSpecsUser && options.date) {
			//console.log('subjectData checkedIn', subjectObject, options)
			const lastCheckin = remoteData.Messages.lastCheckin(subjectObject.subject)
			//console.log('subjectData lastCheckin', lastCheckin)
			const assocDate = subjectData.dates(lastCheckin)
				.reduce((pv, cv, i) => !i ? cv : pv, false)
			//console.log('subjectData assocDate', assocDate)
			if(assocDate && assocDate.id) return assocDate.id
		//with options.day and subjectObject specifies a user
			//if there is an active day associated with the user return the id
		} else if(subjectObjectSpecsUser && options.day) {
			//console.log('subjectData checkedIn', subjectObject, options)
			const lastCheckin = remoteData.Messages.lastCheckin(subjectObject.subject)
			//console.log('subjectData lastCheckin', lastCheckin)
			const assocDay = subjectData.days(lastCheckin)
				.reduce((pv, cv, i) => !i ? cv : pv, false)
			//console.log('subjectData assocDay', assocDay)
			if(assocDay && assocDay.id) return assocDay.id
		//with options.day and subjectObject specifies a user
			//if there is an active day associated with the user return the id
		}
		//no valid options
			//this can either return 
				//the checkinSubjectObject if subjectObject specifies a user
				//checkinSubjectObjects for currently checked in (directly only, so it works better for who else is checked into a set than a date) users if subjectObject is checkinable
		if(subjectObjectSpecsUser) {
			return remoteData.Messages.lastCheckin(subjectObject.subject)
		}

		const subjectCheckinsFilter = _.assign({}, subjectObject, {messageType: 3})
		const subjectDirectCheckins = remoteData.Messages.getFiltered(subjectCheckinsFilter)
		const subjectCurrentDirectCheckins = subjectDirectCheckins
			.filter(checkin => remoteData.Messages.lastCheckin(checkin.fromuser).id === checkin.id)

		return subjectCurrentDirectCheckins

	},
	feelingClass: subjectObject => {
		const myRating = getRating(subjectObject.subject, subjectObject.subjectType, auth.userId())
		const strength = myRating ? 'strong' : 'weak'
		const averageFeeling = myRating ? myRating :
			remoteData.Messages.getFiltered
		//two fields: strength and feeling
			//both are based on rating
				//if there is a my rating for the subject or a secondary in the last year, strength is strong
				//otherwise, strength is weak
				//for feeling base number: 
					//if strong, use the strong rating
					//use most recent my rating
					//use average of ratings of subject and secondaries
					//return unsure if no ratings
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
	dates: (subjectObject, filterSortMapReduce) => {
		if(!subjectObject) return []
		const primaryField = remoteData[subjectDataField(subjectObject.subjectType)]
		const lowerDates = primaryField.getSubDateIds ? primaryField.getSubDateIds(subjectObject.subject) : []
		const higherDates = primaryField.getDateId ? [primaryField.getDateId(subjectObject.subject)] : []
		const allDates = [...(lowerDates ? lowerDates : []), ...(higherDates ? higherDates : [])]
			.filter(x => x)
		//console.log('subjectData dates', subjectObject, allDates, primaryField.getDateId(subjectObject.subject))
		return remoteData.Dates.getMany(allDates)
	},
	days: (subjectObject, filterSortMapReduce) => {
		if(!subjectObject) return []
		const primaryField = remoteData[subjectDataField(subjectObject.subjectType)]
		const lowerDays = primaryField.getSubDayIds ? primaryField.getSubDayIds(subjectObject.subject) : []
		const higherDays = primaryField.getDayId ? [primaryField.getDayId(subjectObject.subject)] : []
		const allDays = [...(lowerDays ? lowerDays : []), ...(higherDays ? higherDays : [])]
			.filter(x => x)
		//console.log('subjectData dates', subjectObject, allDates, primaryField.getDateId(subjectObject.subject))
		return remoteData.Days.getMany(allDays)
	},
	sets: (subjectObject, filterSortMapReduce) => {
		if(!subjectObject) return []
		return remoteData.Sets.getMany(
		remoteData[subjectDataField(subjectObject.subjectType)]
			.getSubSetIds(subjectObject.subject)
	)},
	loadMessagesForSubject: subjectObject => {
		//reject if invalid parameters
		if(!subjectObject || !subjectObject.subject) return Promise.reject('invalid Subject Data for load')
		const dataFieldName = 'Messages'
		const baseUrl = dataFieldName
		const secondarySubjects = secondarySubjectObjects(subjectObject.subjectType)(subjectObject)
		const whereString = JSON.stringify({
			or: [subjectObject, ...secondarySubjects]
				.map(so => {return {and: [
					{subject: so.subject},
					{subjectType: so.subjectType}
				]};})
		})

		const end = baseUrl + `?filter={"where":${whereString}}`


		//return and resolve to empty array if 
		const cachePath =  `${subjectObject.subjectType}.${subjectObject.subject}`

		const alreadyLoaded = _.get(subjectLoaded, cachePath, false)
		if(alreadyLoaded) return Promise.resolve([])
		_.set(subjectLoaded, cachePath, true)


		const dataField = remoteData[subjectDataField(subjectObject.subjectType)]
		//get the raw data
		const bulkUpdatePromise = auth.getAccessToken()
			.then(token => m.request(reqOptionsCreate(tokenFunction(token))(end, 'GET')()))
			.then(result => result.data)
			.then(dataField.backfillList)
			.then(unionLocalList('remoteData.' + dataFieldName, {updateMeta: true}))
			.catch(err => {
				//set cache back to empty
				_.set(subjectLoaded, cachePath, false)
				console.error('subjectData loadFor bulkUpdatePromise catch')
				console.dir(subjectObject)
				console.error(err)
			})

		return bulkUpdatePromise
	},
	getDetail: (subjectObject) => {
		//console.log('subjectData getDetail', secondarySubjectObjects(subjectObject.subjectType)(subjectObject.subject))
		const primaryField = remoteData[subjectDataField(subjectObject.subjectType)]
		const name = primaryField.getName(subjectObject.subject)
		if(/undefined/.test(name)) return {}
		const subStrings = [
			primaryField.getTimeString ? primaryField.getTimeString(subjectObject.subject) : ''
		].filter(x => x)
		const subjectRating = subjectData.ratingBy(subjectObject.subject, subjectObject.subjectType, auth.userId())
		//checkin is allowed if subject is:
			//a series/festival/date with an ongoing date (checked in stored at date)
			//an ongoing day (also checkins to date if not already)
			//an ongoing set (also day/date if not checked)
			//a place
			//a venue
		const reviewAllowed = [
			//invalid
			false,
			//user
			false,
			//artist
			true,
			//set
			true,
			//place
			true,
			//venue
			true,
			//series
			true,
			//festival
			true,
			//date
			true,
			//day
			true,
			//message
			false

		][subjectObject.subjectType]
		const checkinAllowed = eventActive(primaryField)(subjectObject)
		const lastCheckin = checkinAllowed && remoteData.Messages.lastCheckin(auth.userId())
		const checkedIn = checkinAllowed && subjectObject.subject === lastCheckin.subject && subjectObject.subjectType === lastCheckin.subjectType

		const relatedMessages = remoteData.Messages.getFiltered(subjectObject)

		const checkins = relatedMessages
			.filter(m => m.messageType === 3)

		const allPrimaryReviewMessages = relatedMessages
			.filter(m => m.messageType === 1 || m.messageType === 2)
		//console.log('subjectData getDetail', subjectObject, name)
		
		const secondaryReviewSubjects = secondarySubjectObjects(subjectObject.subjectType)(subjectObject)
		const useSecondary = secondaryReviewSubjects && secondaryReviewSubjects.length

		//console.log('subjectData.getDetail secondaryReviewSubjects', secondaryReviewSubjects)

		const secondaryReviewMessages = (useSecondary ? secondaryReviewSubjects : [])
			.map(remoteData.Messages.getFiltered)
			//.filter(m => console.log('subjectData secondaryReviewMessages', m))
			.reduce((pv, cv) => [...pv, ...cv], [])

		//console.log('subjectData.getDetail secondaryReviewMessages', secondaryReviewMessages)
		
		const reviews = reviewArrays([...allPrimaryReviewMessages, ...secondaryReviewMessages])
		//console.log('subjectData.getDetail reviews', reviews)

		const myReviews = reviews.filter(r => r.author === auth.userId())
		const friendReviews = reviews.filter(r => r.author !== auth.userId())
		const detailObject = {
			name: name,
			subStrings: subStrings,
			rating: subjectRating,
			checkinAllowed: checkinAllowed,
			checkins: checkins,
			reviewAllowed: reviewAllowed,
			checkedIn: checkedIn,
			myReviews: myReviews,
			friendReviews: friendReviews,
			type: subjectDataField(subjectObject.subjectType)
		}
		return detailObject
/*
		
		*/
	}
}