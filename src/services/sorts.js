// sorts.js

import _ from 'lodash'
import moment from 'dayjs'

let timestampCache = {}
let soonestCache = {}

export const timeStampSort = (a, b) => {
	const cachedValue = _.get(timestampCache, `${a.timestamp}.${b.timestamp}`)
	if(cachedValue) return cachedValue
	const am = moment(a.timestamp).utc()
	const bm = moment(b.timestamp).utc()
	const retVal = bm.diff(am)
	_.set(timestampCache, `${a.timestamp}.${b.timestamp}`, retVal)
	return retVal
}

export const soonestStart = (a, b) => {
	const cachedValue = _.get(soonestCache, `${a.start}.${b.start}`)
	if(cachedValue) return cachedValue

}

var futureComboCache = {}

export const futurePrioritySort = (futures, lineups) => (a, b) => {
	const key = '' + a.id + '.' + b.id
	const cached = _.get(futureComboCache, key)
	if(cached !== undefined) return cached
	//console.log('futurePrioritySort not cached')
	//primary: in a lineup for a festival in the future
	const aFuture = _.some(futures, f => lineups.getFiltered({band: a.id, festival: f.id}).length)
	const bFuture = _.some(futures, f => lineups.getFiltered({band: b.id, festival: f.id}).length)
	const usePrimary = aFuture ? !bFuture : bFuture

	if(usePrimary && aFuture) {
		_.set(futureComboCache, key, -1)
		return -1	
	} 
	
	if(usePrimary && bFuture) {
		_.set(futureComboCache, key, 1)
		return 1	
	} 
	//secondary: peak priority level
	const al = lineups.peakArtistPriLevel(a.id)
	const bl = lineups.peakArtistPriLevel(b.id)
	_.set(futureComboCache, key, al-bl)
	return al -bl
}

var artistFestivalCache = {}
var artistFestivalCacheTimes = {}
const artistScore = (messages, artists, lineups, artistPriorities, festivals) => {return {
	friendActivity: () => 0,
	followedActivity: () => 0,
	siteActivity: artistId => {
		if(!artistId) return 0
		const messageCount = messages
			.getDescendants({subjectType: artists.subjectType, subject: artistId})
			.length
		const score = Math.ceil(_.min([Math.log10(messageCount), 9]))

		return score
	},
	peakPriority: artistId => {
		if(!artistId) return 0

		const levels = lineups.getFiltered({band: artistId})
			.sort((a,b) => artistPriorities.getLevel(a.priority) - artistPriorities.getLevel(b.priority))

		if(!levels.length) return -9
		const level = artistPriorities.getLevel(_.first(levels).priority)
		const peakLevel = artistPriorities.peakLevel()
		const peakScore = 9
		const troughLevel = artistPriorities.troughLevel()
		const troughScore = -9
		const levelFraction = (level - peakLevel) / (troughLevel - peakLevel)
		const scoreLength = peakScore - troughScore
		const scoreTravel = levelFraction * scoreLength
		const score = peakLevel + scoreTravel

		return score
	},
	future: artistId => {

		const festivalIds = _.uniq(lineups.getFiltered({band: artistId}).map(x => x.festival))
		const futureFestivals = festivals.future()
		const futureFestivalIds = futureFestivals.map(x => x.id)
		const future = _.some(festivalIds, id => futureFestivalIds.includes(id)) ? 1 : -1

		return future

	}
}}

export const artistSorter = ({Messages, Artists, Lineups, ArtistPriorities, Festivals}) => (sortArray, invertArray = []) => {
	const scoreObject = artistScore(Messages, Artists, Lineups, ArtistPriorities, Festivals)
	const scoreFunction = _.memoize(sortArray.reduce((scoreMethod, methodName, i) => {
		return a => scoreMethod(a) + (invertArray.includes(methodName) ? -1 : 1) * scoreObject[methodName](a) * (100 ** i)
	}, () => 0), a => `${a}-${sortArray.join('.')}-${invertArray.join('.')}`)
	return (a, b) => scoreFunction ? scoreFunction(b) - scoreFunction(a) : 0
}

export const reviewSorter = interactions => viewer => sortArray => _.flatten(
	sortArray
		.sort(timeStampSort)
		.reduce((pv, cv, i, arr) => {
			const user = cv.fromuser === viewer
			//each category sorted by newest date first within that category
			//firstEl reserved for newest review by user
			if(user && !pv[0].length) {
				pv[0] = [cv]
				return pv
			}
			//headEls are the first 5 reviews by followed (maximum of one )
			const followed = !user && interactions.some(int => int.type === FOLLOW && int.subjectType === USER && int.subject === cv.fromuser)
			if(followed && pv[1].length < 5 && !pv[1].some(el => el.fromuser === cv.fromuser)) {
				pv[1].push(cv)
				return pv
			}
			const other = !user && !followed
			if(user) pv[2].push(cv)
			if(followed) pv[3].push(cv)
			if(other) pv[4].push(cv)

			return pv
		}, [
			[], //user current review
			[], //followed reviews
			[], //old user reviews
			[], //old followed reviews
			[] //other reviews
		])
)

export const festivalIdsByEndTimeSort = festivals => (a, b) => {
	const am = festivals.getEndMoment(a)
	const bm = festivals.getEndMoment(b)
	if(am && !bm) return -1
	if(!am && bm) return 1
	if(!am && !bm) return 0
	return festivals.getEndMoment(b).valueOf() - festivals.getEndMoment(a).valueOf()

}



