// filter.js

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

var eventConnectedCache = {}

export default (subjects) => { return  {
	eventConnectedFilter (e) { return m => {
			const cachePath = '' + e.subject + '.' + e.subjectType + '.' + m.subject + '.' + m.subjectType
			const cacheValue = _.get(eventConnectedCache, cachePath)
			if(!_.isUndefined(cacheValue)) return cacheValue
			const typeString = subjectDataField(m.subjectType)
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