// filter.js

import _ from 'lodash'

const subjectDataField = type => {return {
	'10': 'messages',
	'6': 'series',
	'7': 'festivals',
	'8': 'dates',
	'9': 'days',
	'3': 'sets',
	'5': 'venues',
	'4': 'places',
	'2': 'artists',
	'1': 'users'
}[type]}

var eventConnectedCache = {}

export default (subjects) => { return  {
	eventConnectedFilter (e) { return m => {
		//console.log('eventConnectedFilter', e, m)
		const cachePath = '' + e.subject + '.' + e.subjectType + '.' + m.subject + '.' + m.subjectType
		const cacheValue = _.get(eventConnectedCache, cachePath)
		if(!_.isUndefined(cacheValue)) return cacheValue
		const typeString = subjectDataField(e.subjectType)
		//console.log('subjects.Messages.eventConnectedFilter cachePath')
		//console.log(typeString)
		//console.log(cachePath)
		const connected = (m && (!e || subjects[typeString].messageEventConnection(e)(m))) && true || false 
		//console.log('subjects.Messages.eventConnectedFilter event')
		//console.log(e)
		//console.log('subjects.Messages.eventConnectedFilter message')
		//console.log(m)
		//console.log('subjects.Messages.eventConnectedFilter typeString')
		//console.log(typeString)
		//console.log('subjects.Messages.eventConnectedFilter connected')
		//console.log(connected)
		if(!_.isUndefined(m) && !_.isUndefined(e)) _.set(eventConnectedCache, cachePath, connected)
		return connected

	}}  
}}