// data.js
import m from 'mithril'
//import _ from 'lodash'
const Promise = require('promise-polyfill').default

// Services
import Auth from '../services/auth.js';
const auth = new Auth();
var moment = require('moment-timezone');


const reqOptionsCreate = config => (dataFieldName, method = 'POST') => data => { return {
    method: method,
    url: "/api/" + dataFieldName,
  	config: config,
  	data: data
}}

const appendData = dataField => data => dataField.assignList(dataField.list
	.filter(x => x.id !== data.id)
	.concat([data]))

//TODO: when data is requested:
//if that data is present check cache validity with the server. return local data if valid
	//or get an update from the server and supply that

const loadListGen = schema => () => m.request({
	    method: "GET",
	    url: "/api/" + schema,
	})

const ts = () => Math.round((new Date()).getTime() / 1000)

const idFieldFilter = field => field !== 'deleted' && field !== 'timestamp' && field !== 'phptime' && field !== 'festival_series' && field !== 'name' && field !== 'year' && field !== 'content' && field !== 'value' && field !== 'description' && field !== 'level' && field !== 'default' && field !== 'website' && field !== 'language' && field !== 'cost' && field !== 'basedate' && field !== 'mode' && field !== 'start' && field !== 'end'
const tokenFunction = token => function(xhr) {
	xhr.setRequestHeader('Authorization', 'Bearer ' + token)
}

const logResult = result => {
	console.log(result)
	return result
}

const forceRemoteLoad = dataField => result => {
	dataField.reload()
	dataField.loadList()
	return result
}

const reloadAndLog = dataField => {
	const loadField = forceRemoteLoad(dataField)
	return result => _.flow([logResult, loadField])(result)
}

const assignDataToList = dataField => result => {
	//console.log('assigningList length')
	//console.log(dataField.list.length)
	dataField.assignList(result)
	//console.log(dataField.list.length)
	return result
}

const removeDeletedFilter = result => result.filter(d => !d.deleted)

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

var dateBaseCache = {}

const remoteData = {
	Messages: {
		list: [],
		assignList: newList => remoteData.Messages.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Messages.lastRemoteLoad = ts() - remoteData.Messages.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Messages.list, p => p.id === id),
		getMany: ids => remoteData.Messages.list.filter(d => ids.indexOf(d.id) > -1),
		getName: id => {
			const v = remoteData.Messages.get(id)
			if(!v || !v.content) return ''
			//fromuser to touser re:subjectName
			const fromField = remoteData.Users.getName(v.fromuser)
			const toField = v.touser ? ' to ' + remoteData.Users.getName(v.touser) : ''
			const subjectName = ' re: ' + remoteData[subjectDataField(v.subjectType)].getName(v.subject)
			return _.truncate(subjectName)
		},
		aboutType: sType => remoteData.Messages.list.filter(m => m.subjectType === sType),
		ofType: mType => remoteData.Messages.list.filter(m => m.messageType === mType),
		byAuthor: author => remoteData.Messages.list.filter(m => m.fromuser === author),
		ofAndAbout: (mType, sType) => remoteData.Messages.list.filter(m => m.messageType === mType && m.subjectType === sType),
		ofAboutAndBy: (mType, sType, author) => remoteData.Messages.list.filter(m => m.messageType === mType && m.subjectType === sType && m.fromuser === author),
		aboutSets: () => remoteData.Messages.list.filter(m => m.subjectType === 3),
		gameTimeRatings: () => remoteData.Messages.aboutSets().filter(m => m.messageType === 2),
		setAverageRating: setId => {
			const gameTimeRatings = remoteData.Messages.gameTimeRatings()
			const filtered = gameTimeRatings
				.filter(m => (m.subject === setId))
			const retVal = _.meanBy(filtered,
							m => parseInt(m.content, 10))
			//console.log('msg length: ' + remoteData.Messages.list.length)
			//console.log('filtered length: ' + filtered.length)
			//console.log('setAverageRating: ' + retVal)
			//console.log('setId: ' + setId)
			//console.log('gameTimeRatings.length: ' + gameTimeRatings.length)
			return retVal ? retVal : 0
		},
		forArtist: artistId => remoteData.Messages.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId)),
		forSet: setId => remoteData.Messages.aboutSets()
			.filter(m => m.subject === setId),
		forArtistReviewCard: artistId => remoteData.Messages.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId) && m.fromuser)
			.reduce((final, me) => {
				if(!final[me.fromuser]) final[me.fromuser] = []
				final[me.fromuser].push(me)
				final[me.fromuser] = final[me.fromuser]
					.sort((a, b) => a.messageType - b.messageType)
				return final
			}, {}),
		loadList: () => {
			if(ts() > remoteData.Messages.remoteInterval + remoteData.Messages.lastRemoteLoad) return remoteData.Messages.remoteLoad()
			return Promise.resolve(true)

		},
		remoteLoad: () => {
			remoteData.Messages.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
			    	method: "GET",
			    	url: "/api/Messages",
			  		config: tokenFunction(result)
				}))
				.then(removeDeletedFilter)
				.then(assignDataToList(remoteData.Messages))
				.catch(reloadAndLog(remoteData.Messages))
		},
		create: data => {
			const dataFieldName = 'Messages'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(() => remoteData[dataFieldName].list.push(data))
				.then(forceRemoteLoad(remoteData.Messages))
				.catch(logResult)
		}
	},
	Images: {
		list: [],
		assignList: newList => remoteData.Images.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Images.lastRemoteLoad = ts() - remoteData.Images.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Images.list, p => p.id === id),
		getMany: ids => remoteData.Images.list.filter(d => ids.indexOf(d.id) > -1),
		getTitle: id => remoteData.Images.get(id).title,
		getSrc: id => remoteData.Images.get(id).url,
		getAttributionAr: id => {
			const el = remoteData.Images.get(id)
			return el ? [el.title, el.sourceUrl, el.author, el.license, el.licenseUrl] : []
		},
		getName: id => remoteData.Images.getTitle(id),
		forArtist: artistId => remoteData.Images.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId)),
		forSubject: (subjectType, subject) => remoteData.Images.list
			.filter(m => (m.subjectType === subjectType) && (m.subject === subject)),
		loadList: () => {
			if(ts() > remoteData.Images.remoteInterval + remoteData.Images.lastRemoteLoad) remoteData.Images.remoteLoad()
		},
		remoteLoad: () => {
			remoteData.Images.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
				    method: "GET",
				    url: "/api/Images",
				  	config: tokenFunction(result)
				}))
				.then(assignDataToList(remoteData.Images))
				.catch(reloadAndLog(remoteData.Images))
		},
		create: data => {
			const dataFieldName = 'Images'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(() => remoteData[dataFieldName].list.push(data))
				.then(forceRemoteLoad(remoteData.Images))
				.catch(logResult)
		}

	},
	Series: {
		list: [],
		assignList: newList => remoteData.Series.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Series.lastRemoteLoad = ts() - remoteData.Series.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Series.list, p => p.id === id),
		getMany: ids => remoteData.Series.list.filter(d => ids.indexOf(d.id) > -1),
		idFields: () => remoteData.Series.list.length ? 
			Object.keys(remoteData.Series.list[0]).filter(idFieldFilter) : 
			[],
		getEventName: id => {
			const v = remoteData.Series.get(id)
			if(!v || !v.name) return ''
			return v.name
		},
		getEventNames: () => remoteData.Series.list.map(x => x.name),
		getEventNamesWithIds: () => remoteData.Series.list.map(x => [x.name, x.id]),
		getName: id => remoteData.Series.getEventName(id),
		getSubFestivalIds: id => {
			//console.log('Series getSubFestivalIds for ' + id + ' chosen from among ' + remoteData.Festivals.list.length)
			return remoteData.Festivals.list.filter(s => s.series === id).map(s => s.id)
		},
		getSubDateIds: id => {
			const festivals = remoteData.Series.getSubFestivalIds(id)
			return remoteData.Dates.list.filter(s => festivals.indexOf(s.festival) > -1).map(s => s.id)
		},
		getSubDayIds: id => {
			const dates = remoteData.Series.getSubDateIds(id)
			return remoteData.Days.list.filter(s => dates.indexOf(s.date) > -1).map(s => s.id)
		},
		getSubSetIds: id => {
			const days = remoteData.Series.getSubDayIds(id)
			return remoteData.Sets.list.filter(s => days.indexOf(s.day) > -1).map(s => s.id)
		},
		getSubIds: id => remoteData.Series.getSubFestivalIds(id),
		loadList: () => {
			if(ts() > remoteData.Series.remoteInterval + remoteData.Series.lastRemoteLoad) remoteData.Series.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Series.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
				    method: "GET",
				    url: "/api/Series",
				  	config: tokenFunction(result)
				}))
				.then(assignDataToList(remoteData.Series))
				.catch(reloadAndLog(remoteData.Series))
		},
		create: data => {
			const dataFieldName = 'Series'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(forceRemoteLoad(remoteData.Series))
				.catch(logResult)
		}

	},
	Festivals: {
		list: [],
		assignList: newList => remoteData.Festivals.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Festivals.lastRemoteLoad = ts() - remoteData.Festivals.remoteInterval + 1,
		remoteInterval: 86400,
		idFields: () => remoteData.Festivals.list.length ? 
			Object.keys(remoteData.Festivals.list[0]).filter(idFieldFilter) : 
			[],
		get: id => _.find(remoteData.Festivals.list, p => p.id === id),
		getMany: ids => remoteData.Festivals.list.filter(d => ids.indexOf(d.id) > -1),
		getSeriesId: id => {
			const fest = _.find(remoteData.Festivals.list, p => p.id === id)
			if(!fest) return
			return fest.series
		},
		getSubDateIds: id => {
			return remoteData.Dates.list.filter(s => s.festival === id).map(s => s.id)
		},
		getSubDayIds: id => {
			const dates = remoteData.Festivals.getSubDateIds(id)
			return remoteData.Days.list.filter(s => dates.indexOf(s.date) > -1).map(s => s.id)
		},
		getSubSetIds: id => {
			const days = remoteData.Festivals.getSubDayIds(id)
			return remoteData.Sets.list.filter(s => days.indexOf(s.day) > -1).map(s => s.id)
		},
		getSuperId: id => remoteData.Festivals.getSeriesId(id),
		getSubIds: id => remoteData.Festivals.getSubDateIds(id),
		getPeerIds: id => remoteData.Series.getSubIds(remoteData.Festivals.getSuperId(id))
			.filter(x => x !== id),
		getLineupArtistIds: id => remoteData.Lineups.getFestivalArtistIds(id),
		eventActive: id => remoteData.Festivals.get(id) && (parseInt(remoteData.Festivals.get(id).year, 10) >= (new Date().getFullYear())),
		getEventName: id => {
			const v = remoteData.Festivals.get(id)
			if(!v || !v.year) return ''
			return remoteData.Series.getEventName(v.series) + ' ' + v.year
		},
		getEventNames: () => remoteData.Festivals.list.map(x => remoteData.Series.getEventName(x.series) + ' ' + x.year),
		getEventNamesWithIds: superId => remoteData.Festivals.list
			.filter(e => !superId || e.series === superId)
			.map(x => [remoteData.Festivals.getEventName(x.id), x.id]),
		getName: id => remoteData.Festivals.getEventName(id),
		loadList: () => {
			if(ts() > remoteData.Festivals.remoteInterval + remoteData.Festivals.lastRemoteLoad) remoteData.Festivals.remoteLoad()

		},
		future: _.memoize(() => {
			//console.log('' + remoteData.Festivals.list.length + '-' + remoteData.Dates.list.length)
			const futureDates = remoteData.Dates.future()
			//console.log(futureDates.length)
			return remoteData.Festivals.getMany(futureDates
				.map(d => d.festival))
			}, 
			() => '' + remoteData.Festivals.list.length + '-' + remoteData.Dates.list.length),
		remoteLoad: () => {
			remoteData.Festivals.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Festivals",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Festivals))
				.catch(reloadAndLog(remoteData.Festivals))
		},
		create: data => {
			const dataFieldName = 'Festivals'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(forceRemoteLoad(remoteData.Festivals))
				.catch(logResult)
		}
	},
	Dates: {
		list: [],
		assignList: newList => remoteData.Dates.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Dates.lastRemoteLoad = ts() - remoteData.Dates.remoteInterval + 1,
		remoteInterval: 86400,
		idFields: () => remoteData.Dates.list.length ? 
			Object.keys(remoteData.Dates.list[0]).filter(idFieldFilter) : 
			[],
		get: id => _.find(remoteData.Dates.list, p => p.id === id),
		getMany: ids => remoteData.Dates.list.filter(d => ids.indexOf(d.id) > -1),
		getFestivalId: id => {
			const date = remoteData.Dates.get(id)
			if(!date) return
			return date.festival
		},
		getSeriesId: id => {
			return remoteData.Festivals.getSeriesId(remoteData.Dates.getFestivalId(id))
			
		},
		getSubDayIds: id => {
			return remoteData.Days.list.filter(s => s.date === id).map(s => s.id)
		},
		getSubSetIds: id => {
			const days = remoteData.Dates.getSubDayIds(id)
			return remoteData.Sets.list.filter(s => days.indexOf(s.day) > -1).map(s => s.id)
		},
		getSuperId: id => remoteData.Dates.getFestivalId(id),
		getSubIds: id => remoteData.Dates.getSubDayIds(id),
		getPeerIds: id => remoteData.Festivals.getSubIds(remoteData.Dates.getSuperId(id))
			.filter(x => x !== id),
		getLineupArtistIds: id => {
			const festivalId = remoteData.Dates.getFestivalId(id)
			if(!festivalId) return
			return remoteData.Lineups.getFestivalArtistIds(festivalId)

		},
		
		getEventName: id => {
			const v = remoteData.Dates.get(id)
			if(!v || !v.name) return ''
			return remoteData.Festivals.getEventName(v.festival) + ' ' + v.name
		},
		getEventNames: () => remoteData.Dates.list.map(x => remoteData.Festivals.getEventName(x.festival) + ' ' + x.name),
		getEventNamesWithIds: superId => remoteData.Dates.list
			.filter(e => !superId || e.festival === superId)
			.map(x => [remoteData.Festivals.getEventName(x.festival) + ' ' + x.name, x.id]),
		getName: id => remoteData.Dates.getEventName(id),
		loadList: () => {
			if(ts() > remoteData.Dates.remoteInterval + remoteData.Dates.lastRemoteLoad) remoteData.Dates.remoteLoad()

		},
		getBaseMoment: id => {
			if(dateBaseCache[id]) return moment(dateBaseCache[id])
			const date = remoteData.Dates.get(id)
			if(!date) throw 'remoteData.Dates.getBaseMoment nonexistent date ' + id
			const timezone = remoteData.Venues.getTimezone(date.venue)
			const momentString = date.basedate + ' 10:00'
			const momentFormat = 'Y-M-D H:mm'
			const m = moment.tz(momentString, momentFormat, timezone)
			dateBaseCache[id] = m
			return moment(m)
		},
		getStartMoment: id => remoteData.Dates.getBaseMoment(id).subtract(1, 'days'),
		getEndMoment: id => {
			const days = remoteData.Dates.getSubDayIds(id)
			return remoteData.Dates.getStartMoment(id).add(days.length + 2, 'days')
		},
		current: () => remoteData.Dates.list.filter(d => {
			//now is greater than the start moment but less than the end moment
			var now = moment()
			var start = remoteData.Dates.getStartMoment(d.id)
			var end = remoteData.Dates.getEndMoment(d.id)
			return now.isBetween(start, end, 'day')
		}),
		soon: () => {
			const current = remoteData.Dates.current()
				.map(d => d.id)
			return remoteData.Dates.list.filter(d => {
					//now is greater than the start moment but less than the end moment
					var now = moment()
					var start = remoteData.Dates.getStartMoment(d.id)
					var end = moment().add(30, 'days')
					return start.isBetween(now, end, 'day')
				})
					.filter(d => current.indexOf(d.id) < 0)
		},
		future: () => {
			const current = remoteData.Dates.current()
				.map(d => d.id)
			return remoteData.Dates.list.filter(d => {
				//now is greater than the start moment but less than the end moment
				var now = moment()
				var start = remoteData.Dates.getStartMoment(d.id)
				return start.isAfter(now, 'day')
			})
				.filter(d => current.indexOf(d.id) < 0)
		},
		remoteLoad: () => {
			remoteData.Dates.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Dates",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Dates))
				.catch(reloadAndLog(remoteData.Dates))
		},
		createWithDays: data => {
			const dataFieldName = 'Dates/createWithDays'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(forceRemoteLoad(remoteData.Dates))
				.then(forceRemoteLoad(remoteData.Days))
				.catch(logResult)
		}
	},
	Days: {
		list: [],
		assignList: newList => remoteData.Days.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Days.lastRemoteLoad = ts() - remoteData.Days.remoteInterval + 1,
		remoteInterval: 86400,
		idFields: () => remoteData.Days.list.length ? 
			Object.keys(remoteData.Days.list[0]).filter(idFieldFilter) : 
			[],
		get: id => _.find(remoteData.Days.list, p => p.id === id),
		getMany: ids => remoteData.Days.list.filter(d => ids.indexOf(d.id) > -1),
		getDateId: id => {
			const day = remoteData.Days.get(id)
			if(!day) return
			return day.date
		},
		getFestivalId: id => {
			return remoteData.Dates.getFestivalId(remoteData.Days.getDateId(id))
		},
		getSeriesId: id => {
			return remoteData.Festivals.getSeriesId(remoteData.Dates.getFestivalId(remoteData.Days.getDateId(id)))
			
		},
		getSubSetIds: id => {
			return remoteData.Sets.list.filter(s => s.day === id).map(s => s.id)
		},
		getSuperId: id => remoteData.Days.getDateId(id),
		getSubIds: id => remoteData.Days.getSubSetIds(id),
		getPeerIds: id => remoteData.Dates.getSubIds(remoteData.Days.getSuperId(id))
			.filter(x => x !== id),
		
		getEventName: id => {
			const v = remoteData.Days.get(id)
			if(!v || !v.name) return ''
			return remoteData.Dates.getEventName(v.date) + ' ' + v.name
		},
		getEventNames: () => remoteData.Days.list.map(x => remoteData.Dates.getEventName(x.date) + ' ' + x.name),
		getEventNamesWithIds: superId => remoteData.Days.list
			.filter(e => !superId || e.date === superId)
			.map(x => [remoteData.Dates.getEventName(x.date) + ' ' + x.name, x.id]),
		getName: id => remoteData.Days.getEventName(id),
		loadList: () => {
			if(ts() > remoteData.Days.remoteInterval + remoteData.Days.lastRemoteLoad) remoteData.Days.remoteLoad()

		},
		getBaseMoment: id => {
			if(!id) return
			
			const superMoment = remoteData.Dates.getBaseMoment(remoteData.Days.getSuperId(id))
			return superMoment.add(remoteData.Days.get(id).daysOffset, 'days')
		},
		remoteLoad: () => {
			remoteData.Days.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Days",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Days))
				.catch(reloadAndLog(remoteData.Days))
		}
	},
	Sets: {
		list: [],
		assignList: newList => remoteData.Sets.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Sets.lastRemoteLoad = ts() - remoteData.Sets.remoteInterval + 1,
		remoteInterval: 86400,
		idFields: () => remoteData.Sets.list.length ? 
			Object.keys(remoteData.Sets.list[0]).filter(idFieldFilter) : 
			[],
		get: id => _.find(remoteData.Sets.list, p => p.id === id),
		getMany: ids => remoteData.Sets.list.filter(d => ids.indexOf(d.id) > -1),
		getDayId: id => {
			const set = remoteData.Sets.get(id)
			if(!set) return
			return set.day
		},
		getDateId: id => {
			return remoteData.Days.getDateId(remoteData.Sets.getDayId(id))
		},
		getFestivalId: id => {
			return remoteData.Dates.getFestivalId(remoteData.Days.getDateId(remoteData.Sets.getDayId(id)))
		},
		getSeriesId: id => {
			return remoteData.Festivals.getSeriesId(remoteData.Dates.getFestivalId(remoteData.Days.getDateId(remoteData.Sets.getDayId(id))))
			
		},
		getArtistId: id => {
			const set = remoteData.Sets.get(id)
			if(!set) return
			return set.band
		},
		getArtistName: id => {
			return remoteData.Artists.getName(remoteData.Sets.getArtistId(id))
			
		},
		wellAttended: (min = 2) => {
			//at least min checkins

		},
		topSets: () => {
			//at least two checkins
			//more than half people who checked in rated it 5
		},
		getSuperId: id => remoteData.Sets.getDayId(id),
		getPeerIds: id => remoteData.Days.getSubIds(remoteData.Sets.getSuperId(id))
			.filter(x => x !== id),
		getEventName: id => remoteData.Sets.getArtistName(id) + ': ' + remoteData.Festivals.getEventName(remoteData.Sets.getFestivalId(id)),
		getEventNames: () => remoteData.Sets.list.map(x => remoteData.Sets.getEventName(x.id)),
		getEventNamesWithIds: superId => remoteData.Sets.list
			.filter(e => !superId || e.day === superId)
			.map(x => [remoteData.Sets.getEventName(x.id), x.id]),
		getName: id => remoteData.Sets.getEventName(id),
		forDayAndStage: (day, stage) => remoteData.Sets.list
			.filter(s => s.day === day && s.stage === stage),
		forArtist: artistId => remoteData.Sets.list
			.filter(s => s.band === artistId),
		loadList: () => {
			if(ts() > remoteData.Sets.remoteInterval + remoteData.Sets.lastRemoteLoad) remoteData.Sets.remoteLoad()

		},
		getStartMoment: id => {
			const superMoment = remoteData.Days.getBaseMoment(remoteData.Sets.getSuperId(id))
			return superMoment.add(remoteData.Sets.get(id).start, 'minutes')
		},
		getEndMoment: id => {
			const superMoment = remoteData.Days.getBaseMoment(remoteData.Sets.getSuperId(id))
			return superMoment.add(remoteData.Sets.get(id).end, 'minutes')
		},
		getSetTimeText: id => {
			const startMoment = remoteData.Sets.getStartMoment(id)
			const endMoment = remoteData.Sets.getEndMoment(id)
			return startMoment.format('h:mm') + '-' + endMoment.format('h:mm')
		},
		remoteLoad: () => {
			remoteData.Sets.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Sets",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Sets))
				.catch(reloadAndLog(remoteData.Sets))
		},
		createForDays: (daysObject, user) => {
			const end = 'Sets/forDay/'
			const optionFuncs = Object.keys(daysObject)
				.map(day => {
					return token => reqOptionsCreate(tokenFunction(token))(end + day)({
								user: user,
								artistIds: daysObject[day]
				})})
			const reqPromiseArray = function (result) {
					return optionFuncs.map(optionFunc => m.request(optionFunc(result)))

			}
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => Promise.all(reqPromiseArray(result)))
				.then(forceRemoteLoad(remoteData.Sets))
				.catch(logResult)
		},
		batchCreate: data => {
			const end = 'Sets/batchCreate'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Sets))
				.catch(logResult)
		},
		batchDelete: data => {
			const end = 'Sets/batchDelete'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Sets))
				.catch(logResult)
		},
		batchUpdate: data => {
			const end = 'Sets/batchUpdate'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Sets))
				.catch(logResult)
		},
		upsert: data => {
			const end = 'Sets'
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end, 'PUT')(data)))
				.then(forceRemoteLoad(remoteData.Sets))
				.catch(logResult)

		},
		delete: data => {
			const end = 'Sets/' + data.id
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end, 'DELETE')(data)))
				.then(forceRemoteLoad(remoteData.Sets))
				.catch(logResult)

		}
	},
	Venues: {
		list: [],
		assignList: newList => remoteData.Venues.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Venues.lastRemoteLoad = ts() - remoteData.Venues.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Venues.list, p => p.id === id),
		getMany: ids => remoteData.Venues.list.filter(d => ids.indexOf(d.id) > -1),
		idFields: () => remoteData.Venues.list.length ? 
			Object.keys(remoteData.Venues.list[0]).filter(idFieldFilter) : 
			[],
		getPlaceName: id => {
			const v = remoteData.Venues.get(id)
			if(!v || !v.name) return ''
			return v.name
		},
		getTimezone: id => {
			const v = remoteData.Venues.get(id)
			if(!v || !v.name) return ''
			return v.timezone
		},
		getPlaceNames: () => remoteData.Venues.list.map(x => x.name),
		getPlaceNamesWithIds: () => remoteData.Venues.list.map(x => [x.name, x.id]),
		getName: id => remoteData.Venues.getPlaceName(id),
		
		loadList: () => {
			if(ts() > remoteData.Venues.remoteInterval + remoteData.Venues.lastRemoteLoad) remoteData.Venues.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Venues.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Venues",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Venues))
				.catch(reloadAndLog(remoteData.Venues))
		},
		create: data => {
			const dataFieldName = 'Venues'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(forceRemoteLoad(remoteData.Venues))
				.catch(logResult)
		}
	},
	Organizers: {
		list: [],
		assignList: newList => remoteData.Organizers.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Organizers.lastRemoteLoad = ts() - remoteData.Organizers.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.Organizers.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.Organizers.remoteInterval + remoteData.Organizers.lastRemoteLoad) remoteData.Organizers.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Organizers.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Organizers",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Organizers))
				.catch(reloadAndLog(remoteData.Organizers))
		}
	},
	Places: {
		list: [],
		assignList: newList => remoteData.Places.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Places.lastRemoteLoad = ts() - remoteData.Places.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Places.list, p => p.id === id),
		getMany: ids => remoteData.Places.list.filter(d => ids.indexOf(d.id) > -1),
		forFestival: festivalId => _.uniqBy(remoteData.Places.list
			.filter(d => d.festival === festivalId), x => x.name)
			.sort((a, b) => a.priority - b.priority),
		forSeries: seriesId => _.uniqBy(_.flatMap(
			remoteData.Series.getSubIds(seriesId),
			remoteData.Places.forFestival
		), x => x.name),
		prevPlaces: festivalId => remoteData.Places.forFestival(
			_.max(remoteData.Festivals.getPeerIds(festivalId))
		),
		idFields: () => remoteData.Places.list.length ? 
			Object.keys(remoteData.Places.list[0]).filter(idFieldFilter) : 
			[],
		getName: id => remoteData.Places.get(id).name,
		loadList: () => {
			if(ts() > remoteData.Places.remoteInterval + remoteData.Places.lastRemoteLoad) return remoteData.Places.remoteLoad()
			return Promise.resolve(true)
		},
		remoteLoad: () => {
			remoteData.Places.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
			    	method: "GET",
			    	url: "/api/Places",
			  		config: tokenFunction(result)
				}))
				.then(assignDataToList(remoteData.Places))
				.catch(reloadAndLog(remoteData.Places))
		},
		stagesForFestival: data => {
			const end = 'Places/batchCreate/'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			//console.log('stagesForFestival')
			//console.log(data)
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Places))
				.catch(logResult)
		},
		batchDelete: data => {
			const end = 'Places/batchDelete'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Places))
				.catch(logResult)
		}
	},
	Lineups: {
		list: [],
		assignList: newList => remoteData.Lineups.list = newList,
		append: data => appendData(remoteData.Lineups)(data),
		lastRemoteLoad: 0,
		reload: () => remoteData.Lineups.lastRemoteLoad = ts() - remoteData.Lineups.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.Lineups.list.filter(d => ids.indexOf(d.id) > -1),
		forFestival: fest => remoteData.Lineups.list.filter(d => d.festival === fest),
		getPriFromArtistFest: (artist, fest) => {
			const target = _.find(remoteData.Lineups.list, p => p.festival === fest && p.band === artist)
			if(!target) return
			return target.priority
		},
		getIdFromArtistFest: (artist, fest) => {
			const target = _.find(remoteData.Lineups.list, p => p.festival === fest && p.band === artist)
			if(!target) return
			return target.id
		},
		artistLineups: artist => remoteData.Lineups.list
			.filter(p => p.band === artist),
		peakArtistPriLevel: _.memoize(artist => _.min(remoteData.Lineups.artistLineups(artist)
			.map(l => remoteData.ArtistPriorities.getLevel(l.priority))
			.filter(l => l)), 
			artist => '' + artist + '-' + remoteData.Lineups.list.length + '-' + remoteData.ArtistPriorities.list.length),
		festivalsForArtist: artist => _.uniq(remoteData.Lineups.artistLineups(artist)
			.map(p => p.festival)),
		artistInLineup: artist => _.some(remoteData.Lineups.list,
			p => p.band === artist),
		artistInFestival: _.memoize((artist, fest) => _.some(remoteData.Lineups.list,
					p => p.band === artist && p.festival === fest), (artist, fest) => '' + artist + '-' + fest),
		forFestival: fest => remoteData.Lineups.list.filter(l => l.festival === fest),
		festHasLineup: fest => _.some(remoteData.Lineups.list, l => l.festival === fest),
		getFestivalArtistIds: fest => remoteData.Lineups.list.filter(l => l.festival === fest).map(l => l.band),
		getNotFestivalArtistIds: fest => {
			const excludeIds = remoteData.Lineups.getFestivalArtistIds(fest)
			return remoteData.Artists.list
				.filter(artist => excludeIds.indexOf(artist.id) < 0)
				.map(artist => artist.id)
			},
		loadList: () => {
			if(ts() > remoteData.Lineups.remoteInterval + remoteData.Lineups.lastRemoteLoad) remoteData.Lineups.remoteLoad()

		},
		create: data => {
			const dataFieldName = 'Lineups'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(() => remoteData[dataFieldName].list.push(data))
				.then(forceRemoteLoad(remoteData.Lineups))
				.catch(logResult)
		},
		remoteLoad: () => {
			remoteData.Lineups.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Lineups",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Lineups))
				.catch(reloadAndLog(remoteData.Lineups))
		},
		upload: (data, festivalId) => {
			const dataFieldName = 'Artists/festivalLineup/' + festivalId
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(forceRemoteLoad(remoteData.Lineups))
				.then(forceRemoteLoad(remoteData.Artists))
				.catch(logResult)
		},
		addArtist: (data, festivalId) => {
			const dataFieldName = 'Artists/addToLineup/' + festivalId
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(artistData => {
					//console.log('artistData')
					//console.log(artistData)
					remoteData.Artists.append(artistData.id.artist)
					remoteData.Lineups.append(artistData.id.lineup)
					m.redraw()
					return artistData
				})
				//.then(logResult)
				.then(forceRemoteLoad(remoteData.Lineups))
				.then(forceRemoteLoad(remoteData.Artists))
				.catch(logResult)
		},
		batchDelete: data => {
			const end = 'Lineups/batchDelete'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Lineups))
				.catch(logResult)
		},
		batchUpdate: data => {
			const end = 'Lineups/batchUpdate'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Lineups))
				.catch(logResult)
		}
	},
	ArtistPriorities: {
		list: [],
		assignList: newList => remoteData.ArtistPriorities.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.ArtistPriorities.lastRemoteLoad = ts() - remoteData.ArtistPriorities.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.ArtistPriorities.list, p => p.id === id),
		getMany: ids => remoteData.ArtistPriorities.list.filter(d => ids.indexOf(d.id) > -1),
		getName: id => {
			const data = remoteData.ArtistPriorities.get(id)
			if(!data) return
			return data.name

		},
		getLevel: id => {
			const data = remoteData.ArtistPriorities.get(id)
			if(!data) return
			return data.level

		},
		loadList: () => {
			if(ts() > remoteData.ArtistPriorities.remoteInterval + remoteData.ArtistPriorities.lastRemoteLoad) remoteData.ArtistPriorities.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.ArtistPriorities.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/ArtistPriorities",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.ArtistPriorities))
				.catch(reloadAndLog(remoteData.ArtistPriorities))
		}
	},
	StagePriorities: {
		list: [],
		assignList: newList => remoteData.StagePriorities.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.StagePriorities.lastRemoteLoad = ts() - remoteData.StagePriorities.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.StagePriorities.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.StagePriorities.remoteInterval + remoteData.StagePriorities.lastRemoteLoad) remoteData.StagePriorities.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.StagePriorities.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/StagePriorities",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.StagePriorities))
				.catch(reloadAndLog(remoteData.StagePriorities))
		}
	},
	StageLayouts: {
		list: [],
		assignList: newList => remoteData.StageLayouts.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.StageLayouts.lastRemoteLoad = ts() - remoteData.StageLayouts.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.StageLayouts.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.StageLayouts.remoteInterval + remoteData.StageLayouts.lastRemoteLoad) remoteData.StageLayouts.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.StageLayouts.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/StageLayouts",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.StageLayouts))
				.catch(reloadAndLog(remoteData.StageLayouts))
		}
	},
	PlaceTypes: {
		list: [],
		assignList: newList => remoteData.PlaceTypes.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.PlaceTypes.lastRemoteLoad = ts() - remoteData.PlaceTypes.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.PlaceTypes.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.PlaceTypes.remoteInterval + remoteData.PlaceTypes.lastRemoteLoad) remoteData.PlaceTypes.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.PlaceTypes.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/PlaceTypes",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.PlaceTypes))
				.catch(reloadAndLog(remoteData.PlaceTypes))
		}
	},
	ArtistAliases: {
		list: [],
		assignList: newList => remoteData.ArtistAliases.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.ArtistAliases.lastRemoteLoad = ts() - remoteData.ArtistAliases.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.ArtistAliases.list, p => p.id === id),
		getMany: ids => remoteData.ArtistAliases.list.filter(d => ids.indexOf(d.id) > -1),
		forArtist: artistId => remoteData.ArtistAliases.list
			.filter(d => d.band === artistId),
		idFields: () => remoteData.ArtistAliases.list.length ? 
			Object.keys(remoteData.ArtistAliases.list[0]).filter(idFieldFilter) : 
			[],
		loadList: () => {
			if(ts() > remoteData.ArtistAliases.remoteInterval + remoteData.ArtistAliases.lastRemoteLoad) return remoteData.ArtistAliases.remoteLoad()
			return Promise.resolve(true)
		},
		remoteLoad: () => {
			remoteData.ArtistAliases.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
			    	method: "GET",
			    	url: "/api/ArtistAliases",
			  		config: tokenFunction(result)
				}))
				.then(assignDataToList(remoteData.ArtistAliases))
				.catch(reloadAndLog(remoteData.ArtistAliases))
		},
		batchCreate: data => {
			const end = 'ArtistAliases/batchCreate/'
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.ArtistAliases))
				.catch(logResult)
		},
		batchDelete: data => {
			const end = 'ArtistAliases/batchDelete'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.ArtistAliases))
				.catch(logResult)
		}
	},
	Artists: {
		list: [],
		assignList: newList => remoteData.Artists.list = newList,
		append: data => appendData(remoteData.Artists)(data),
		lastRemoteLoad: 0,
		reload: () => remoteData.Artists.lastRemoteLoad = ts() - remoteData.Artists.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Artists.list, p => p.id === id),
		getMany: ids => remoteData.Artists.list.filter(d => ids.indexOf(d.id) > -1),
		getName: id => {
			const data = remoteData.Artists.get(id)
			if(!data) return
			return data.name

		},
		virgins: () => remoteData.Artists.list
			.filter(a => remoteData.Lineups.artistInLineup(a.id))
			.filter(ar => !remoteData.Messages.forArtist(ar.id).length)
			.sort((a, b) => {
				//primary: in a lineup for a festival in the future
				const futures = remoteData.Festivals.future()
				const aFuture = _.some(futures, f => remoteData.Lineups.artistInFestival(a.id, f.id))
				const bFuture = _.some(futures, f => remoteData.Lineups.artistInFestival(b.id, f.id))
				const usePrimary = aFuture ? !bFuture : bFuture
				if(usePrimary && aFuture) return -1
				if(usePrimary && bFuture) return 1
				//secondary: peak priority level
				const al = remoteData.Lineups.peakArtistPriLevel(a.id)
				const bl = remoteData.Lineups.peakArtistPriLevel(b.id)
				return al -bl
			}),
			//no comment
			//no rating
			//no set with a rating
			//no set with a comment
		idFields: () => remoteData.Artists.list.length ? 
			Object.keys(remoteData.Artists.list[0]).filter(idFieldFilter) : 
			[],
		loadList: () => {
			if(ts() > remoteData.Artists.remoteInterval + remoteData.Artists.lastRemoteLoad) remoteData.Artists.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Artists.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Artists",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Artists))
				.catch(reloadAndLog(remoteData.Artists))
		},
		update: (data, id) => {
			const end = 'Artists/update?where={"id":' + id + '}'
			//console.log('update artists')
			//console.log(data)
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.Artists))
				.catch(logResult)
		},
		merge: (id1, id2) => {
			const end = 'Artists/admin/merge/' + id1 + '/' + id2
			//console.log('update artists')
			//console.log(data)
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)()))
				.then(forceRemoteLoad(remoteData.Artists))
				.catch(logResult)

		}
	},
	ParentGenres: {
		list: [],
		assignList: newList => remoteData.ParentGenres.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.ParentGenres.lastRemoteLoad = ts() - remoteData.ParentGenres.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.ParentGenres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.ParentGenres.remoteInterval + remoteData.ParentGenres.lastRemoteLoad) remoteData.ParentGenres.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.ParentGenres.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/ParentGenres",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.ParentGenres))
				.catch(reloadAndLog(remoteData.ParentGenres))
		}
	},
	Genres: {
		list: [],
		assignList: newList => remoteData.Genres.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Genres.lastRemoteLoad = ts() - remoteData.Genres.remoteInterval + 2,
		remoteInterval: 86400,
		getMany: ids => remoteData.Genres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.Genres.remoteInterval + remoteData.Genres.lastRemoteLoad) remoteData.Genres.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Genres.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Genres",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Genres))
				.catch(reloadAndLog(remoteData.Genres))
		}
	},
	ArtistGenres: {
		list: [],
		assignList: newList => remoteData.ArtistGenres.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.ArtistGenres.lastRemoteLoad = ts() - remoteData.ArtistGenres.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.ArtistGenres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.ArtistGenres.remoteInterval + remoteData.ArtistGenres.lastRemoteLoad) remoteData.ArtistGenres.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.ArtistGenres.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/ArtistGenres",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.ArtistGenres))
				.catch(reloadAndLog(remoteData.ArtistGenres))
		}
	},
	Users: {
		list: [],
		assignList: newList => remoteData.Users.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Users.lastRemoteLoad = ts() - remoteData.Users.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Users.list, p => p.id === id),
		getMany: ids => remoteData.Users.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.Users.remoteInterval + remoteData.Users.lastRemoteLoad) remoteData.Users.remoteLoad()

		},
		getName: id => {
			const data = remoteData.Users.get(id)
			if(!data) return ''
			return data.username

		},
		getPic: id => {
			const data = remoteData.Users.get(id)
			if(!data) return ''
			return data.picture

		},
		remoteLoad: () => {
			remoteData.Users.lastRemoteLoad = ts()
			return auth.getAccessToken()
				.then(result => m.request({
		    	method: "GET",
		    	url: "/api/Profiles",
		  		config: tokenFunction(result)
			}))
				.then(assignDataToList(remoteData.Users))
				.catch(reloadAndLog(remoteData.Users))
		}
	}
}

const subjectData = {
	name: (sub, type) => remoteData[subjectDataField(type)].getName(sub),
	ratingBy: (sub, type, author) => {
		const mType = 2
		//const ratings = remoteData.Messages.ofType(mType)
		//const aboutArtists = remoteData.Messages.aboutType(type)
		//const byAuthor = remoteData.Messages.byAuthor(author)
		const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
		const subRating = authorRatings.filter(m => m.subject === sub)

		const rate = subRating.length ? parseInt(subRating[0].content, 10) : 0
		//console.log('subjectData ratingBy ' + rate + ' sub: ' + sub + 'type: ' + type + 'author: ' + author)
		//console.log('subjectData authorRatings ' + authorRatings.length)
		//console.log('subjectData aboutArtists ' + aboutArtists.length)
		//console.log('subjectData ratings ' + ratings.length)
		//console.log('subjectData byAuthor ' + byAuthor.length)
		//console.log('subjectData byAuthor add ' + (author + 1))
		//console.log('subjectData byFromuser add ' + (remoteData.Messages.list[0].fromuser + 1))
		//console.log('subjectData subRating ' + subRating.length)
		return rate
	},
	commentBy: (sub, type, author) => {
		const mType = 1
		//const ratings = remoteData.Messages.ofType(mType)
		//const aboutArtists = remoteData.Messages.aboutType(type)
		//const byAuthor = remoteData.Messages.byAuthor(author)
		const authorComments = remoteData.Messages.ofAboutAndBy(mType, type, author)
		const subComment = authorComments.filter(m => m.subject === sub)

		const comment = subComment.length ? subComment[0].content : ''
		//console.log('subjectData ratingBy ' + comment + ' sub: ' + sub + 'type: ' + type + 'author: ' + author)
		//console.log('subjectData authorRatings ' + authorRatings.length)
		//console.log('subjectData aboutArtists ' + aboutArtists.length)
		//console.log('subjectData ratings ' + ratings.length)
		//console.log('subjectData byAuthor ' + byAuthor.length)
		//console.log('subjectData byAuthor add ' + (author + 1))
		//console.log('subjectData byFromuser add ' + (remoteData.Messages.list[0].fromuser + 1))
		//console.log('subjectData subRating ' + subRating.length)
		return comment
	},
	imagePreset: type => 'artist'
}



exports.remoteData = remoteData
exports.subjectData = subjectData

