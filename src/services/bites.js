// services/bites.js
import m from 'mithril'
import _ from 'lodash'
import ActivityCard from '../components/cards/ActivityCard.jsx';
import SetCard from '../components/cards/SetCard.jsx';
import ArtistCard from '../components/cards/ArtistCard.jsx';
import { subjectCard } from '../components/cards/subjectCard.js';
import globals from "./globals"

const biteCache = {}
const biteTimes = {}
/************

User subjects

*************/
//artists researched
const artistsResearchedPostProcess = ms => _.uniqBy(ms, 'subject')

const artistsResearchedCount = (researcherId, messages) => messages
	.lbfilter({
		fields: { id: true, subject: true, subjectType: true },
		where: {
			and: [
				{ fromuser: researcherId },
				{ subjectType: globals.ARTIST },
				{
					or: [
						{ messageType: globals.RATING },
						{ messageType: globals.COMMENT }
					]
				}
			]
		}
	})
	.then(artistsResearchedPostProcess)
	.then(ar => ar.length)
	.then(count => {
		_.set(biteTimes, `users.artistsResearched[${researcherId}]`, Date.now())
		_.set(biteCache, `users.artistsResearched[${researcherId}]`, count ? count : 0)
	})
const artistsResearched = (researcherId, messages) => {
	const cacheTime = _.get(biteTimes, `users.artistsResearched[${researcherId}]`, 0)
	const cacheOk = cacheTime + 60000 > Date.now()
	if (!cacheOk) artistsResearchedCount(researcherId, messages)
		.catch(console.log)
	return _.get(biteCache, `users.artistsResearched[${researcherId}]`, 0)
}
const artistsResearchedBite = (researcherId, messages) => {
	const value = artistsResearched(researcherId, messages)
	const title = 'Artists Researched'
	return {
		value: value,
		title: title
	}
}
//sets watched
const setsWatchedPostProcess = ms => _.uniqBy(ms, 'subject')

const setsWatchedCount = (watcherId, messages) => messages
	.lbfilter({
		fields: { id: true, subject: true, subjectType: true },
		where: {
			and: [
				{ fromuser: watcherId },
				{ subjectType: globals.SET },
				{
					or: [
						{ messageType: globals.RATING },
						{ messageType: globals.COMMENT },
						{ messageType: globals.CHECKIN }
					]
				}
			]
		}
	})
	.then(setsWatchedPostProcess)
	.then(ar => ar.length)
	.then(count => {
		_.set(biteTimes, `users.setsWatched[${watcherId}]`, Date.now())
		_.set(biteCache, `users.setsWatched[${watcherId}]`, count ? count : 0)
	})
const setsWatched = (watcherId, messages) => {
	const cacheTime = _.get(biteTimes, `users.setsWatched[${watcherId}]`, 0)
	const cacheOk = cacheTime + 60000 > Date.now()
	if (!cacheOk) setsWatchedCount(watcherId, messages)
		.catch(console.log)
	return _.get(biteCache, `users.setsWatched[${watcherId}]`, 0)
}
const setsWatchedBite = (watcherId, messages) => {
	const value = setsWatched(watcherId, messages)
	const title = 'Sets Watched'
	return {
		value: value,
		title: title
	}
}
//recent favorite
const recentFavoriteCount = (reviewerId, messages) => messages
	.lbfilter({
		where: {
			and: [
				{ fromuser: reviewerId },
				{ messageType: globals.RATING },
				{
					or: [
						{ subjectType: globals.SET },
						{ subjectType: globals.ARTIST }
					]
				},
				{ content: '5' }
			]
		},
		order: [
			'subjectType DESC',
			'id DESC'
		],
		limit: 1
	})
	.then(fav => {
		_.set(biteTimes, `users.recentFavorite[${reviewerId}]`, Date.now())
		_.set(biteCache, `users.recentFavorite[${reviewerId}]`, fav[0] ? fav[0] : 0)
		return fav[0]
	})
	.then(fav => fav && messages.subjectDetails({ subjectType: globals.MESSAGE, subject: fav.id }))
const recentFavorite = (reviewerId, messages) => {
	const cacheTime = _.get(biteTimes, `users.recentFavorite[${reviewerId}]`, 0)
	const cacheOk = cacheTime + 60000 > Date.now()
	if (!cacheOk) recentFavoriteCount(reviewerId, messages)
		.catch(console.log)
	return _.get(biteCache, `users.recentFavorite[${reviewerId}]`, 0)
}
const recentFavoriteBite = (reviewerId, messages, artists, subjectData) => {
	const baseValue = recentFavorite(reviewerId, messages)
	//console.log('recentFavoriteBite', baseValue)
	const value = baseValue ? subjectCard(baseValue, {
		userId: reviewerId,
		uiClass: ''


	}) : ''


	const title = 'Recent Favorite'
	return {
		value: value,
		title: title
	}
}

// returns given number of random bites about the subject in an array

export default function (so, { Messages: messages, Artists: artists }, subjectData, count = 3) {
	return [
		artistsResearchedBite(so.subject, messages),
		setsWatchedBite(so.subject, messages),
		recentFavoriteBite(so.subject, messages, artists, subjectData)
	]
}