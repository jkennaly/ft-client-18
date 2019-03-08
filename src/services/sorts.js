// sorts.js

import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

let timestampCache = {}

export const timeStampSort = (a, b) => {
	const cachedValue = _.get(timestampCache, `${a.timestamp}.${b.timestamp}`)
	if(cachedValue) return cachedValue
	const am = moment(a.timestamp).utc()
	const bm = moment(b.timestamp).utc()
	const retVal = bm.diff(am)
	_.set(timestampCache, `${a.timestamp}.${b.timestamp}`, retVal)
	return retVal
}
