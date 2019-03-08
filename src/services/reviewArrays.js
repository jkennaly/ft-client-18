// reviewArrays.js

import _ from 'lodash'
import moment from 'moment'
import {sameSubject} from './subjectFunctions'

//compose an array of review messages (ratings/comments) into an array of reviewArrays
//each reviewArray contains the following elements:
	//[0.author, 1.subject, 2.rating, 3.comment, 4.timestamp, 5.ratingId, 6.commentId]
		//e.g.: [0, {subject: 0, subjectType: 0}, 0, 'ok, not great', 1551648054119, 0, 42]

//convert each review message to a reviewArray
const reviewArrayFromMessage = message => [
	message.fromuser,
	{subject: message.subject, subjectType: message.subjectType},
	message.messageType === 2 ? message.content : 0,
	message.messageType === 1 ? message.content : '',
	message.timestamp,
	message.messageType === 2 ? message.id : 0,
	message.messageType === 1 ? message.id : 0

]

const createBlackout = (baseMoment, count, type) => {
	const blackoutStart = moment(baseMoment).subtract(count, type)
	const blackoutEnd = moment(baseMoment).add(count, type)
	return testMoment => moment(testMoment).isBetween(blackoutStart, blackoutEnd)
}

const blackoutClearFilter = blackouts => ra => blackouts
	.reduce((clear, blackout) => clear && !blackout(ra[4]), true)

//add a layer of depth to reviewArrays, grouping by merge prep (up to 1 comment, up to 1 rating)
const createPreMergeArrays = reviewArrays => {
	//console.log('reviewArrays createPreMergeArrays', reviewArrays)
	let usedRatings = []
	const ratingArrays = reviewArrays.filter(m => m[2])
	const commentArrays = reviewArrays.filter(m => m[3])
	const commentPreMerges = commentArrays.map(commentArray => {
		//possible rating are from the same authro and on the same subject
			//sort them most recent first
		const possibleRatings = ratingArrays
			.filter(ratingArray => ratingArray[0] === commentArray[0])
			.filter(ratingArray => sameSubject(ratingArray[1], commentArray[1]))
			.sort((a, b) => moment(a[4]).diff(b[4]))

		//if there are no possible ratings, we can return the preMergeArray now
		if(!possibleRatings.length) return [commentArray]
		//if there is only 1 rating it, use that
		if(possibleRatings.length === 1) {
			usedRatings.push(possibleRatings[0][5])
			return [commentArray, possibleRatings[0]]
		}
		//if there are multiple possible ratings to associate:
			//find all ratings made within 24 hours of the comment and pick most recent
		const dayBlackout = createBlackout(commentArray[4], 1, 'day')
		const withinDay = possibleRatings
			.find(ratingArray => dayBlackout(ratingArray[4]))

		if(withinDay) {
			usedRatings.push(withinDay[5])
			return [commentArray, withinDay]
		}
		
		//if there are multiple possible ratings to associate:
			//find all ratings made within 24 hours of the comment and pick most recent
		const withinYearStart = moment(commentArray[4]).subtract(1, 'year')
		const withinYearEnd = moment(commentArray[4]).add(1, 'year')
		const withinYear = possibleRatings
			.find(ratingArray => moment(ratingArray[4])
				.isBetween(withinYearStart, withinYearEnd)
			)

		if(withinYear) {
			usedRatings.push(withinYear[5])
			return [commentArray, withinYear]
		}

		//return the most recent if nothing else matched
		usedRatings.push(possibleRatings[0][5])
		return [commentArray, possibleRatings[0]]


	})
	//console.log('reviewArrays createPreMergeArrays commentPreMerges', commentPreMerges)
	const usedRatingsMoments = usedRatings
		.map(id => ratingArrays.find(r => r[5] === id))
		.map(ratingArray => moment(ratingArray[4]))

	const blackouts = usedRatingsMoments
		.map(m => createBlackout(m, 30, 'day'))

	const allBlackouts = ratingArrays
		.map(ratingArray => moment(ratingArray[4]))
		.map(m => createBlackout(m, 30, 'day'))

	//console.log('reviewArrays createPreMergeArrays blackouts set')
	
	const ratingPreMerges = ratingArrays
		.filter(ra => usedRatings.indexOf(ra[5]) < 0)
		//not blacked out by a rating used on a comment
		.filter(blackoutClearFilter(blackouts))
		//not blacked out by a more recent rating
		.filter((ra, i, raa) => {
			recentBlackouts = allBlackouts.slice(0, i)
			return(blackoutClearFilter(recentBlackouts)(ra))
		})
		.map(ra => [ra])

	const allPreMerges = [...commentPreMerges, ...ratingPreMerges]
	//console.log('reviewArrays allPreMerges ', allPreMerges)

	return allPreMerges
}

const mergeArray = preMerge => {
	//if there is only one array, return it
	if(preMerge.length === 1) return preMerge[0]
	//otherwise, there is one comment and one rating
	const commentField = preMerge[0][3] ? preMerge[0][3] : preMerge[1][3]
	const commentIdField = preMerge[0][6] ? preMerge[0][6] : preMerge[1][6]
	const ratingField = preMerge[0][2] ? preMerge[0][2] : preMerge[1][2]
	const ratingIdField = preMerge[0][5] ? preMerge[0][5] : preMerge[1][5]
	//use the timestamp from the comment
	const timestampField = preMerge[0][3] ? preMerge[0][4] : preMerge[1][4]
	//the other fields are the same

	return {
		author: preMerge[0][0],
		subjectObject: preMerge[0][1],
		rating: parseInt(ratingField, 10
			),
		comment: commentField,
		timestamp: timestampField,
		ratingId: ratingIdField,
		commentId: commentIdField

	}

}

export const reviewArrays = messageArray => {
	const messageReviewArrays = messageArray.map(reviewArrayFromMessage)
	//console.log('reviewArrays messageReviewArrays ', messageReviewArrays)
	return createPreMergeArrays(messageReviewArrays)
		.map(mergeArray)
}
