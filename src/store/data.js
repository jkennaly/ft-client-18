// data.js
import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'
const Promise = require('promise-polyfill').default
import localforage from 'localforage'

// Services
import Auth from '../services/auth.js';
const auth = new Auth();

const timeStampSort = (a, b) => {
	const am = moment(a.timestamp).utc()
	const bm = moment(b.timestamp).utc()
	return bm.diff(am)
}

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

const fullRequest = (url, dataFieldName) => authResult => m.request({
	method: "GET",
	//use the dataFieldName after the last dot to access api
	url: url ? url : "/api/" + dataFieldName.slice(_.lastIndexOf(dataFieldName, '.') + 1),
		config: tokenFunction(authResult)
})

const updateRequest = timestamp => (url, dataFieldName) => authResult => {
	const filterString = 'filter[where][timestamp][gte]=' + moment(timestamp).format("YYYY-MM-DD HH:mm:ss")
	return m.request({
	    	method: "GET",
	    	//use the dataFieldName after the last dot to access api
	    	url: (url ? url : "/api/" + dataFieldName.slice(_.lastIndexOf(dataFieldName, '.') + 1)) + '?' + filterString,
	  		config: tokenFunction(authResult)
	})
}

const logResult = result => {
	console.log(result)
	return result
}

const logText = text => result => {
	console.log(text)
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

const localDataPresent = key => localforage.keys()
	//.then(logText('localDataPresent'))
	//.then(keys => {console.log(keys); return keys;})
	.then(keys => keys && keys.indexOf(key) > -1)
	//.then(logResult)
	//.then(logText(key))
	.catch(err => console.log(err))

const stale = (interval, lastRemoteLoad) => {
	const now = ts()
	const nextRemoteCheck = interval + lastRemoteLoad
	return Promise.resolve(now < nextRemoteCheck)
}

const localLastRemoteLoadValid = (key, interval) => localforage.getItem(key + '.lastRemoteLoad')
	.then(lastRemoteLoad => stale(interval, lastRemoteLoad))
	.then(logText('localLastRemoteLoadValid ' + key))
	.then(logResult)

const getMeta = dataFieldName => localforage
	.getItem(dataFieldName + '_meta')

	//choose between full update and partial update
	//use a partial update if dataFieldName_meta.timestamps[1] is defined and truthy in localforage
		//if performing a partial update, load the timestamp to the update function and then return it
	//otherwise return the full update function
const getUpdateFunctionPromise = dataFieldName => getMeta(dataFieldName)
	.then(meta => {
		const usePartialUpdate = meta && meta.timestamps && meta.timestamps.length && meta.timestamps[1]
		const updateFunction = usePartialUpdate ? updateRequest(meta.timestamps[1]) : fullRequest
		return updateFunction
	})
	.catch(err => console.log(err))


const localLoad = (dataField, dataFieldName) => localforage.getItem(dataFieldName)
	//.then(logText('local assign'))
	//.then(logResult)
	.then(assignDataToList(dataField))
	.then(result => {
		localforage.getItem(dataFieldName + '.lastRemoteLoad')
			.then(lastRemoteLoad => dataField.lastRemoteLoad = lastRemoteLoad)
		return result
	})
	.then(result => {
		//loadValid will be swallowed and is only present to spawn the remoteLoad if needed
		const loadValid = localLastRemoteLoadValid(dataFieldName, dataField.remoteInterval)
			.then(localValid => {
				if(!localValid) return dataField.remoteLoad()
				//this m.redraw() is equivalent to redrawing once an m.request completes
				m.redraw()
				return Promise.resolve(true)
			})
		return result
	})
	.catch(reloadAndLog(dataField))

//updateList returns a Promise that
	//resolves to true if the list in memory is valid
	//resolves to localLoad(dataField) if the local data is newer than the mem data
		//also spawns a dataField.remoteLoad() if the local data is stale
	//resolves to dataField.remoteLoad() otherwise
const updateList = (dataField, dataFieldName) => {
	//check if the memory list is valid
	const now = ts()
	const nextRemoteCheck = dataField.remoteInterval + dataField.lastRemoteLoad
	if(dataFieldName === 'remoteData.Messages') {
		console.log('remoteData.Messages updateList skip ' + (now < nextRemoteCheck))
	}
	if(now < nextRemoteCheck) return Promise.resolve(true)
	if(false && dataFieldName === 'remoteData.Messages') {
		console.log('remoteData.Messages updateList remoteLoad reqd ' + (now - nextRemoteCheck))
		console.log('remoteData.Messages updateList remoteLoad nextRemoteCheck ' + (nextRemoteCheck))
	}
	//check if there is local data present
	return localLastRemoteLoadValid(dataFieldName, dataField.remoteInterval)
		//this will resolve true if a local load is needed
		.then(dataPresent => dataPresent ? localLoad(dataField, dataFieldName) : dataField.remoteLoad())
		.catch(err => console.log(err))

}
const loadRemote = (dataField, dataFieldName, url) => {
	
	if(dataFieldName === 'remoteData.Messages') {
		console.log('remoteData.Messages loadRemote')
}
	const authChain = auth.getAccessToken()
	const requestFunctionChain = getUpdateFunctionPromise(dataFieldName)
	

	return Promise.all([authChain, requestFunctionChain])
		.then(values => values[1](url, dataFieldName)(values[0]))
		.then(removeDeletedFilter)
		.then(saveLocalList(dataField, dataFieldName))
		.then(logText('remote assign'))
		.then(result => {
			dataField.lastRemoteLoad = ts()
			return result
		})
		.then(assignDataToList(dataField))
		.catch(err => console.log(err))
}

const saveLocalList = ({lastRemoteLoad}, dataFieldName) => result => {
	const meta = result
		.reduce((meta, el) => {
			const m = moment(el.timestamp).valueOf()
			const i = el.id
			meta.timestamps[0] = m && m < meta.timestamps[0] ? m : meta.timestamps[0]
			meta.timestamps[1] = m && m > meta.timestamps[1] ? m : meta.timestamps[1]
			meta.ids[0] = i && i < meta.ids[0] ? i : meta.ids[0]
			meta.ids[1] = i && i > meta.ids[1] ? i : meta.ids[1]
			return meta
		}, {timestamps: [Infinity, 0], ids: [Infinity, 0]})
	localforage.setItem(dataFieldName + '_meta', meta)
		.catch(err => console.log(err))
	localforage.getItem(dataFieldName)
		.then(oldData => {
			//if there's no old data, save the entire result
			if(!oldData || !oldData.length) {
				localforage.setItem(dataFieldName, result)
			//if there is old data, splice the old data with the new data
			}	else {
				localforage.setItem(dataFieldName, _.unionBy(result, oldData, 'id'))
				
				}
		})
	
		.catch(err => console.log(err))
	localforage.setItem(dataFieldName + '.lastRemoteLoad', lastRemoteLoad)
		.catch(err => console.log(err))
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

const messageEventConnection = typeString => {return {
	//a message about a place is connected to an event if:
		//the event is associated with a festival that has/will host(ed) the place
	Places: (m, e) => true,
	//a message about a user is connected to an event if:
	Users: (m, e) => false
}[typeString]}

const simpleDate = str => moment(str, 'YYYY-MM-DD', true).isValid()

const researchApplicable = (content, opt) => {
	if(!content) return true
	if(simpleDate(content)) return moment().isSameOrBefore(moment(content, 'YYYY-MM-DD', true), 'day')
	//if content starts with 'fest' and opt.festival is defined then parse the festivalId
	const optFest = opt.festivalId
	const contentFest = content.indexOf('fest ') === 0
	const contentFestId = contentFest && parseInt(content.slice(5), 10)
	if(optFest) {
		if (optFest === contentFestId) return true
		return false
	} else {
		if(contentFestId) return false
	}
	return true
}

var dateBaseCache = {}

var eventConnectedCache = {}

export const remoteData = {
	Messages: {
		list: [],
		assignList: newList => remoteData.Messages.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Messages.lastRemoteLoad = ts() - remoteData.Messages.remoteInterval + 1,
		remoteInterval: 6000,
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
		getSubjectObject: id => {return {subjectType: 10, subject: id}},
		//follow the message chain until reaching a message that is not about a message
		messageEventConnection: e => {
			const mConnect = m => {
				const typeString = subjectDataField(m.subjectType)
				if(typeString !== 'Messages') return remoteData[typeString].messageEventConnection(e)(m)
				return mConnect(remoteData.Messages.get(m.subject))
		}},
		eventConnectedFilter: e => m => {
			const cachePath = '' + e.subject + '.' + e.subjectType + '.' + m.subject + '.' + m.subjectType
			const cacheValue = _.get(eventConnectedCache, cachePath)
			if(!_.isUndefined(cacheValue)) return cacheValue
			const typeString = subjectDataField(m.subjectType)
			const connected = (m && (!e || remoteData[typeString].messageEventConnection(e)(m))) && true || false 
			//console.log('remoteData.Messages.eventConnectedFilter event')
			//console.log(e)
			//console.log('remoteData.Messages.eventConnectedFilter message')
			//console.log(m)
			//console.log('remoteData.Messages.eventConnectedFilter typeString')
			//console.log(typeString)
			//console.log('remoteData.Messages.eventConnectedFilter connected')
			//console.log(connected)
			if(!_.isUndefined(m) && !_.isUndefined(e)) _.set(eventConnectedCache, cachePath, connected)
			return connected

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
		recentCommentsAll: () => remoteData.Messages.list
			.filter(m => m.messageType === 1),
		recentDiscussionAll: viewer => remoteData.Messages.list
			.filter(m => !viewer || viewer !== m.fromuser)
			.filter(m => m.messageType === 8 || m.messageType === 1)
			.filter(m => remoteData.MessagesMonitors.unread(m.id)),
		recentDiscussionEvent: (viewer, event) => remoteData.Messages.recentDiscussionAll(viewer)
			.filter(remoteData.Messages.eventConnectedFilter(event)),
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
					.sort((a, b) => {
						if(a.messageType - b.messageType) return a.messageType - b.messageType
						return timeStampSort(a, b)
					})
				return final
			}, {}),
		forced: ({artistIds, festivalId}) => _.uniq(remoteData.Messages.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 4 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject)),
		skipped: ({artistIds, festivalId}) => _.uniq(remoteData.Messages.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 5 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject)),
		saved: ({artistIds, festivalId}) => _.uniq(remoteData.Messages.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 6 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject)),
		hidden: ({artistIds, festivalId}) => _.uniq(remoteData.Messages.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 7 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject)),
		recentRatings: ({artistIds, author}) => _.uniq(remoteData.Messages.list
			.filter(m => m.subjectType === 2 && m.messageType === 2 && m.fromuser === author && _.includes(artistIds, m.subject))
			.filter(m => moment(m.timestamp).add(1, 'y').isAfter())
			.map(m => m.subject)),
		loadList: () => updateList(remoteData.Messages, 'remoteData.Messages'),
		remoteLoad: () => loadRemote(remoteData.Messages, 'remoteData.Messages'),
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
		},
		upsert: data => {
			const end = 'Messages'
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end, 'PUT')(data)))
				.then(forceRemoteLoad(remoteData.Messages))
				.catch(logResult)

		},
		updateInstance: (id, data) => {
			const end = 'Messages/' + id
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end, 'PUT')(data)))
				.then(forceRemoteLoad(remoteData.Messages))
				.then(() => m.redraw())
				.catch(logResult)

		}
	},
	MessagesMonitors: {
		list: [],
		assignList: newList => remoteData.MessagesMonitors.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.MessagesMonitors.lastRemoteLoad = ts() - remoteData.MessagesMonitors.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.MessagesMonitors.list, p => p.id === id),
		getMany: ids => remoteData.MessagesMonitors.list.filter(d => ids.indexOf(d.id) > -1),
		unread: id => _.every(remoteData.MessagesMonitors.list, v => v.message !== id),
		loadList: () => updateList(remoteData.MessagesMonitors, 'remoteData.MessagesMonitors'),
		remoteLoad: () => loadRemote(remoteData.MessagesMonitors, 'remoteData.MessagesMonitors'),
		markRead: id => {
			const data = {message:id}
			//mark locally
			remoteData.MessagesMonitors.list.push(data)
			//send to server
			remoteData.MessagesMonitors.create(data)

		},
		create: data => {
			const dataFieldName = 'MessagesMonitors'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(dataFieldName)(data)))
				.then(forceRemoteLoad(remoteData.MessagesMonitors))
				.then(forceRemoteLoad(remoteData.Messages))
				.catch(logResult)
		},
		batchCreate: data => {
			const end = 'MessagesMonitors/batchCreate/'
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.MessagesMonitors))
				.catch(logResult)
		},
		batchDelete: data => {
			const end = 'MessagesMonitors/batchDelete'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return auth.getAccessToken()
				.then(result => m.request(reqOptionsCreate(tokenFunction(result))(end)(data)))
				.then(forceRemoteLoad(remoteData.MessagesMonitors))
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
		messageEventConnection: e => m => false,
		forArtist: artistId => remoteData.Images.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId)),
		forSubject: (subjectType, subject) => remoteData.Images.list
			.filter(m => (m.subjectType === subjectType) && (m.subject === subject)),
		loadList: () => updateList(remoteData.Images, 'remoteData.Images'),
		remoteLoad: () => loadRemote(remoteData.Images, 'remoteData.Images'),
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
		getSubjectObject: id => {return {subjectType: 6, subject: id}},
		isEvent: subject => subject.subjectType === 6,
		messageEventConnection: e => m => remoteData.Series.isEvent(m) && 
			remoteData.Series.isEvent(e) && 
			m.subject === e.subject,
		loadList: () => updateList(remoteData.Series, 'remoteData.Series'),
		remoteLoad: () => loadRemote(remoteData.Series, 'remoteData.Series'),
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
		getResearchList: (id, author) => {
			const artists = remoteData.Artists.getMany(remoteData.Lineups.getFestivalArtistIds(id))
			const artistIds = artists
				.map(a => a.id)
			const researchObject = {
				forces: remoteData.Messages.forced({
					artistIds: artistIds,
					festivalId: id
				}),
				skips: remoteData.Messages.skipped({
					artistIds: artistIds,
					festivalId: id
				}),
				saves: remoteData.Messages.saved({
					artistIds: artistIds,
					festivalId: id
				}),
				hides: remoteData.Messages.hidden({
					artistIds: artistIds,
					festivalId: id
				}),
				recents: remoteData.Messages.recentRatings({
					artistIds: artistIds,
					author: author
				})
			}
			return artists
				.filter(a => {
					//in
					const forced = _.includes(researchObject.forces, a.id)
					//out
					const recent = !forced && _.includes(researchObject.recents, a.id)
					const skipped = !forced && !recent && _.includes(researchObject.skips, a.id)
					const saved = !forced && !recent && !skipped && _.includes(researchObject.saves, a.id)
					const hidden = !forced && !recent && !skipped && !saved && _.includes(researchObject.hides, a.id)
					return forced || !recent && !skipped && !saved && !hidden
				})
				.sort((a, b) => {
					const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, id)
					const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, id)
					if(aPriId === bPriId) return a.name.localeCompare(b.name)
					const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
					const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
					return aPriLevel - bPriLevel
		})},
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
		getSubjectObject: id => {return {subjectType: 7, subject: id}},
		isEvent: subject => subject.subjectType === 7,
		messageEventConnection: e => m => remoteData.Festivals.isEvent(m) && 
			remoteData.Festivals.isEvent(e) && 
			m.subject === e.subject,
		loadList: () => updateList(remoteData.Festivals, 'remoteData.Festivals'),
		remoteLoad: () => loadRemote(remoteData.Festivals, 'remoteData.Festivals'),
		future: _.memoize(() => {
			//console.log('' + remoteData.Festivals.list.length + '-' + remoteData.Dates.list.length)
			const futureDates = remoteData.Dates.future()
			//console.log(futureDates.length)
			return remoteData.Festivals.getMany(futureDates
				.map(d => d.festival))
			}, 
			() => '' + remoteData.Festivals.list.length + '-' + remoteData.Dates.list.length),
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
		loadList: () => updateList(remoteData.Dates, 'remoteData.Dates'),
		remoteLoad: () => loadRemote(remoteData.Dates, 'remoteData.Dates'),
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
		getSubjectObject: id => {return {subjectType: 8, subject: id}},
		isEvent: subject => subject.subjectType === 8,
		messageEventConnection: e => m => remoteData.Dates.isEvent(m) && 
			remoteData.Dates.isEvent(e) && 
			m.subject === e.subject,
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
		loadList: () => updateList(remoteData.Days, 'remoteData.Days'),
		remoteLoad: () => loadRemote(remoteData.Days, 'remoteData.Days'),
		getBaseMoment: id => {
			if(!id) return
			
			const superMoment = remoteData.Dates.getBaseMoment(remoteData.Days.getSuperId(id))
			return superMoment.add(remoteData.Days.get(id).daysOffset, 'days')
		},
		getSubjectObject: id => {return {subjectType: 9, subject: id}},
		isEvent: subject => subject.subjectType === 9,
		messageEventConnection: e => m => remoteData.Days.isEvent(m) && 
			remoteData.Days.isEvent(e) && 
			m.subject === e.subject,
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
		loadList: () => updateList(remoteData.Sets, 'remoteData.Sets'),
		remoteLoad: () => loadRemote(remoteData.Sets, 'remoteData.Sets'),
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
		getSubjectObject: id => {return {subjectType: 3, subject: id}},
		isEvent: subject => subject.subjectType === 3,
		messageEventConnection: e => m => remoteData.Sets.isEvent(m) && 
			remoteData.Sets.isEvent(e) && 
			m.subject === e.subject,
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
		getDateIds: id => remoteData.Dates.list
			.filter(d => d.venue === id)
			.map(d => d.id),
		getSubjectObject: id => {return {subjectType: 5, subject: id}},
		isVenue: subject => subject.subjectType === 5,
		//a message about a venue is connected to an event if:
		//the event is associated with a date that has been/will be at the venue
		messageEventConnection: e => m => remoteData.Venues.isVenue(m) && (m.subject === e.id ||
			_.find(getDateIds(m.subject), 
				d => remoteData.Dates.messageEventConnection(e)(
					remoteData.Dates.getSubjectObject(d)
				)
			)
		),
		loadList: () => updateList(remoteData.Venues, 'remoteData.Venues'),
		remoteLoad: () => loadRemote(remoteData.Venues, 'remoteData.Venues'),
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
		loadList: () => updateList(remoteData.Organizers, 'remoteData.Organizers'),
		remoteLoad: () => loadRemote(remoteData.Organizers, 'remoteData.Organizers'),
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
		loadList: () => updateList(remoteData.Places, 'remoteData.Places'),
		remoteLoad: () => loadRemote(remoteData.Places, 'remoteData.Places'),
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
		festivalsForArtist: _.memoize(artist => _.uniq(remoteData.Lineups.artistLineups(artist)
			.map(p => p.festival)), 
			artist => '' + artist + '-' + remoteData.Lineups.list.length),
		artistInLineup: _.memoize(artist => _.some(remoteData.Lineups.list,
			p => p.band === artist)),
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
		loadList: () => updateList(remoteData.Lineups, 'remoteData.Lineups'),
		remoteLoad: () => loadRemote(remoteData.Lineups, 'remoteData.Lineups'),
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
		loadList: () => updateList(remoteData.ArtistPriorities, 'remoteData.ArtistPriorities'),
		remoteLoad: () => loadRemote(remoteData.ArtistPriorities, 'remoteData.ArtistPriorities'),
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
		loadList: () => updateList(remoteData.StageLayouts, 'remoteData.StageLayouts'),
		remoteLoad: () => loadRemote(remoteData.StageLayouts, 'remoteData.StageLayouts'),
	},
	PlaceTypes: {
		list: [],
		assignList: newList => remoteData.PlaceTypes.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.PlaceTypes.lastRemoteLoad = ts() - remoteData.PlaceTypes.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.PlaceTypes.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => updateList(remoteData.PlaceTypes, 'remoteData.PlaceTypes'),
		remoteLoad: () => loadRemote(remoteData.PlaceTypes, 'remoteData.PlaceTypes'),
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
		loadList: () => updateList(remoteData.ArtistAliases, 'remoteData.ArtistAliases'),
		remoteLoad: () => loadRemote(remoteData.ArtistAliases, 'remoteData.ArtistAliases'),
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
		getRating: (id, userId) => {
			const ratings = remoteData.Messages.forArtist(id)
				.filter(m => m.messageType === 2)
				.filter(m => !userId || m.fromuser === userId)
				.sort(timeStampSort)
			const ratingContent = ratings.length ? ratings[0].content : '0'
			const intValue = parseInt(ratingContent, 10)
			//console.log('data.js remoteData.Artists.getRating ratings.length ' + ratings.length )
			//console.log('data.js remoteData.Artists.getRating intValue ' + intValue )
			return intValue
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
		forFestival: festivalId => {
			const artistIds = remoteData.Lineups.getFestivalArtistIds(festivalId)
			return remoteData.Artists.getMany(artistIds)
		},
		getSubjectObject: id => {return {subjectType: 2, subject: id}},
		isArtist: subject => subject.subjectType === 2,

		//a message about an artist is connected to an event if:
		//the event is associated with a festival that has the artist in a lineup
		messageEventConnection: e => m => {
			const mValid = remoteData.Artists.isArtist(m)
			const artistFestivals = remoteData.Lineups.festivalsForArtist(m.subject)
				.map(id => remoteData.Festivals.getSubjectObject(id))
			const retVal = mValid && _.find(
				artistFestivals, 
				f => remoteData.Festivals.messageEventConnection(e)(f)
			)
			//console.log('remoteData.Artists.messageEventConnection')
			//console.log('mValid')
			//console.log(mValid)
			//console.log('artistFestivals')
			//console.log(artistFestivals)
			//console.log('retVal')
			//console.log(retVal)

			return retVal
		},
		loadList: () => updateList(remoteData.Artists, 'remoteData.Artists'),
		remoteLoad: () => loadRemote(remoteData.Artists, 'remoteData.Artists'),
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
		loadList: () => updateList(remoteData.ParentGenres, 'remoteData.ParentGenres'),
		remoteLoad: () => loadRemote(remoteData.ParentGenres, 'remoteData.ParentGenres'),
	},
	Genres: {
		list: [],
		assignList: newList => remoteData.Genres.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Genres.lastRemoteLoad = ts() - remoteData.Genres.remoteInterval + 2,
		remoteInterval: 86400,
		getMany: ids => remoteData.Genres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => updateList(remoteData.Genres, 'remoteData.Genres'),
		remoteLoad: () => loadRemote(remoteData.Genres, 'remoteData.Genres'),
	},
	ArtistGenres: {
		list: [],
		assignList: newList => remoteData.ArtistGenres.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.ArtistGenres.lastRemoteLoad = ts() - remoteData.ArtistGenres.remoteInterval + 1,
		remoteInterval: 86400,
		getMany: ids => remoteData.ArtistGenres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => updateList(remoteData.ArtistGenres, 'remoteData.ArtistGenres'),
		remoteLoad: () => loadRemote(remoteData.ArtistGenres, 'remoteData.ArtistGenres'),
	},
	Users: {
		list: [],
		assignList: newList => remoteData.Users.list = newList,
		lastRemoteLoad: 0,
		reload: () => remoteData.Users.lastRemoteLoad = ts() - remoteData.Users.remoteInterval + 1,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Users.list, p => p.id === id),
		getMany: ids => remoteData.Users.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => updateList(remoteData.Users, 'remoteData.Users'),
		remoteLoad: () => loadRemote(remoteData.Users, 'remoteData.Users', "/api/Profiles"),
		getName: id => {
			const data = remoteData.Users.get(id)
			if(!data) return ''
			return data.username

		},
		getPic: id => {
			const data = remoteData.Users.get(id)
			if(!data) return ''
			return data.picture

		}
	}
}

const getRating = (sub, type, author) => {
		const mType = 2
		const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
		const subRating = authorRatings.filter(m => m.subject === sub)

		const message = subRating[0]
		return message
	}

const getComment = (sub, type, author) => {
		const mType = 1
		const authorRatings = remoteData.Messages.ofAboutAndBy(mType, type, author)
		const subRating = authorRatings.filter(m => m.subject === sub)

		const message = subRating[0]
		return message
	}

export const subjectData = {
	name: (sub, type) => type && sub ? remoteData[subjectDataField(type)].getName(sub) : '',
	ratingBy: (sub, type, author) => {
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
	commentId: (sub, type, author) => {
		const message = getComment(sub, type, author)
		const id = message && message.id
		return id
	},
	imagePreset: type => 'artist'
}