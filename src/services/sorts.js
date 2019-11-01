// sorts.js

import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

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

export const futurePrioritySort = (futures, lineups) => (a, b) => {
	//primary: in a lineup for a festival in the future
	const aFuture = _.some(futures, f => lineups.getFiltered({band: a.id, festival: f.id}).length)
	const bFuture = _.some(futures, f => lineups.getFiltered({band: b.id, festival: f.id}).length)
	const usePrimary = aFuture ? !bFuture : bFuture
	if(usePrimary && aFuture) return -1
	if(usePrimary && bFuture) return 1
	//secondary: peak priority level
	const al = lineups.peakArtistPriLevel(a.id)
	const bl = lineups.peakArtistPriLevel(b.id)
	return al -bl
}
