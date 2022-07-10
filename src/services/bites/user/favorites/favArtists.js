// services/bites/favorites/favArtists.js

//get the FestivalCard for the next festival the user intends


import m from 'mithril'
import _ from 'lodash'
import { subjectCard } from '../../../../components/cards/subjectCard'
import globals from '../../../globals'

const biteCache = {}
const biteTimes = {}

//get future dates
//check if user has an intention for any festivals


const favoriteArtists = (raterId, artists, sets, messages) => messages
	.lbfilter({
		where: {
			and: [
				{ fromuser: raterId },
				{ subjectType: globals.ARTIST },
				{ messageType: globals.RATING },
				{ content: '5' }
			]
		},
		fields: { subject: true }
	})
	.then(favArtistRaw => favArtistRaw.map(x => x.subject))
	.then(_.uniq)
	.then(allFavArtistIds => Promise.all([allFavArtistIds, (sets
		.lbfilter({
			where: {
				and: [
					{ band: { inq: allFavArtistIds } }
				]
			},
			fields: { id: true }
		}))]

	))
	.then(([allFavArtistIds, allArtistSetRaw]) => [allFavArtistIds, _.uniq(allArtistSetRaw.map(x => x.id))])
	.then(([allFavArtistIds, allArtistSetIds]) => Promise.all([allFavArtistIds, messages
		.lbfilter({
			where: {
				and: [
					{ fromuser: raterId },
					{ subjectType: globals.SET },
					{ messageType: globals.RATING },
					{ subject: { inq: allArtistSetIds } },
					{ content: '5' }
				]
			},
			fields: { subject: true }
		})
	]))
	.then(([allFavArtistIds, favSetRaw]) => [allFavArtistIds, _.uniq(favSetRaw.map(x => x.subject))])
	.then(([allFavArtistIds, favSetIds]) => Promise.all([allFavArtistIds, sets
		.lbfilter({
			where: {
				and: [
					{ id: { inq: favSetIds } }
				]
			},
			fields: { band: true },
			order: [
				'id DESC'
			]
		})
	]))
	.then(([allFavArtistIds, favSetArtistRaw]) => [allFavArtistIds, _.uniq(favSetArtistRaw.map(x => x.band))])
	.then(([allFavArtistIds, favSetArtistIds]) => favSetArtistIds.length ? favSetArtistIds : allFavArtistIds)
	.then(favArtistIds => artists.getManyPromise(favArtistIds))
	.then(fav => {
		_.set(biteTimes, `users.favoriteArtists[${raterId}]`, Date.now())
		_.set(biteCache, `users.favoriteArtists[${raterId}]`, fav)
		return fav
	})
const foundArtists = (raterId, artists, sets, messages) => {
	const cacheTime = _.get(biteTimes, `users.favoriteArtists[${raterId}]`, 0)
	const cacheOk = cacheTime + 60000 > Date.now()
	if (!cacheOk) favoriteArtists(raterId, artists, sets, messages)
		.catch(console.log)
	return _.get(biteCache, `users.favoriteArtists[${raterId}]`, [])
}
export default (raterId, artists, sets, messages) => {
	const value = foundArtists(raterId, artists, sets, messages)
		//.filter(x => console.log('foundArtist', x) || true)
		.map(baseValue => subjectCard({ subject: baseValue.id, subjectType: globals.ARTIST }, {
			userId: raterId,
			uiClass: ''
		}))

	//console.log('recentFavoriteBite', baseValue)

	const title = 'Favorite Artists'
	return {
		value: value,
		title: title,
		public: true,
		name: title
	}
}