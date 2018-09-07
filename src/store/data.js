// data.js
const m = require("mithril");
const _ = require('lodash');

const CONFERENCES = [{
	name: "auth0 conf",
	location: "Orlando, FL",
	date: "06/30/2018",
	favorite: true,
	CFP: true,
	CFPDate: "04/20/2018",
	CFPCompleted: false
},
	{
		name: "Mithril conf",
		location: "Boston, MA",
		date: "05/10/2018",
		favorite: true,
		CFP: false,
		CFPDate: "",
		CFPCompleted: false
	},
	{
		name: "ngSurf",
		location: "San Diego, CA",
		date: "04/26/2018",
		favorite: true,
		CFP: true,
		CFPDate: "03/15/2018",
		CFPCompleted: true
	},
	{
		name: "MySQL Conf",
		location: "Miami, FL",
		date: "03/17/2018",
		favorite: false,
		CFP: false,
		CFPDate: "",
		CFPCompleted: false
	}
];

const reqOptionsCreate = config => dataFieldName => data => { return {
    method: "POST",
    url: "/api/" + dataFieldName,
  	config: config,
  	data: data
}}

//TODO: when data is requested:
//if that data is present check cache validity with the server. return local data if valid
	//or get an update from the server and supply that

const loadListGen = schema => () => m.request({
	    method: "GET",
	    url: "/api/" + schema,
	})

const ts = () => Math.round((new Date()).getTime() / 1000)

const idFieldFilter = field => field !== 'deleted' && field !== 'timestamp' && field !== 'phptime' && field !== 'festival_series' && field !== 'name' && field !== 'year' && field !== 'content' && field !== 'value' && field !== 'description' && field !== 'level' && field !== 'default' && field !== 'website' && field !== 'language' && field !== 'cost' && field !== 'basedate' && field !== 'mode' && field !== 'start' && field !== 'end'
const tokenFunction = function(xhr) {
	xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
}

const logResult = result => {
	console.log(result)
	return result
}

const forceRemoteLoad = dataField => result => {
	dataField.lastRemoteLoad = 0
	return result
}

const reloadAndLog = dataField => {
	const loadField = forceRemoteLoad(dataField)
	return result => _.flow([logResult, loadField])(result)
}

const assignDataToList = dataField => result => {
	dataField.list = result
	return result
}

const removeDeletedFilter = result => result.filter(d => !d.deleted)

const remoteData = {
	Messages: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		gameTimeRatings: () => remoteData.Messages.list.filter(m => (m.subjectType === 3) && (m.messageType === 2)),
		setAverageRating: id => {
			const gameTimeRatings = remoteData.Messages.gameTimeRatings()
			const filtered = gameTimeRatings
				.filter(m => (m.subject === id))
			const retVal = _.meanBy(filtered,
							m => parseInt(m.content, 10))
			//console.log('msg length: ' + remoteData.Messages.list.length)
			//console.log('filtered length: ' + filtered.length)
			//console.log('setAverageRating: ' + retVal)
			//console.log('setId: ' + id)
			//console.log('gameTimeRatings.length: ' + gameTimeRatings.length)
			return retVal ? retVal : 0
		},
		loadList: () => {
			if(ts() > remoteData.Messages.remoteInterval + remoteData.Messages.lastRemoteLoad) remoteData.Messages.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Messages.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Messages",
		  		config: tokenFunction
			})
				.then(removeDeletedFilter)
				.then(assignDataToList(remoteData.Messages))
				.catch(reloadAndLog(remoteData.Messages))
		}
	},
	Series: {
		list: [],
		lastRemoteLoad: 0,
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
		getSubFestivalIds: id => {
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
			return m.request({
			    method: "GET",
			    url: "/api/Series",
			  	config: tokenFunction
			})
				.then(assignDataToList(remoteData.Series))
				.catch(reloadAndLog(remoteData.Series))
		},
		create: data => {
			const dataFieldName = 'Series'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return m.request(reqOptionsCreate(tokenFunction)(dataFieldName)(data))
				.then(forceRemoteLoad(remoteData.Series))
				.catch(logResult)
		}

	},
	Festivals: {
		list: [],
		lastRemoteLoad: 0,
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
		getLineupArtistIds: id => remoteData.Lineups.getFestivalArtistIds(id),
		
		getEventName: id => {
			const v = remoteData.Festivals.get(id)
			if(!v || !v.year) return ''
			return remoteData.Series.getEventName(v.series) + ' ' + v.year
		},
		getEventNames: () => remoteData.Festivals.list.map(x => remoteData.Series.getEventName(x.series) + ' ' + x.year),
		getEventNamesWithIds: superId => remoteData.Festivals.list
			.filter(e => !superId || e.series === superId)
			.map(x => [remoteData.Festivals.getEventName(x.id), x.id]),
		loadList: () => {
			if(ts() > remoteData.Festivals.remoteInterval + remoteData.Festivals.lastRemoteLoad) remoteData.Festivals.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Festivals.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Festivals",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Festivals))
				.catch(reloadAndLog(remoteData.Festivals))
		},
		create: data => {
			const dataFieldName = 'Festivals'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return m.request(reqOptionsCreate(tokenFunction)(dataFieldName)(data))
				.then(forceRemoteLoad(remoteData.Festivals))
				.catch(logResult)
		}
	},
	Dates: {
		list: [],
		lastRemoteLoad: 0,
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
		
		getEventName: id => {
			const v = remoteData.Dates.get(id)
			if(!v || !v.name) return ''
			return remoteData.Festivals.getEventName(v.festival) + ' ' + v.name
		},
		getEventNames: () => remoteData.Dates.list.map(x => remoteData.Festivals.getEventName(x.festival) + ' ' + x.name),
		getEventNamesWithIds: superId => remoteData.Dates.list
			.filter(e => !superId || e.festival === superId)
			.map(x => [remoteData.Festivals.getEventName(x.festival) + ' ' + x.name, x.id]),
		loadList: () => {
			if(ts() > remoteData.Dates.remoteInterval + remoteData.Dates.lastRemoteLoad) remoteData.Dates.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Dates.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Dates",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Dates))
				.catch(reloadAndLog(remoteData.Dates))
		},
		createWithDays: data => {
			const dataFieldName = 'Dates/createWithDays'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return m.request(reqOptionsCreate(tokenFunction)(dataFieldName)(data))
				.then(forceRemoteLoad(remoteData.Dates))
				.then(forceRemoteLoad(remoteData.Days))
				.catch(logResult)
		}
	},
	Days: {
		list: [],
		lastRemoteLoad: 0,
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
		
		getEventName: id => {
			const v = remoteData.Days.get(id)
			if(!v || !v.name) return ''
			return remoteData.Dates.getEventName(v.date) + ' ' + v.name
		},
		getEventNames: () => remoteData.Days.list.map(x => remoteData.Dates.getEventName(x.date) + ' ' + x.name),
		getEventNamesWithIds: superId => remoteData.Days.list
			.filter(e => !superId || e.date === superId)
			.map(x => [remoteData.Dates.getEventName(x.date) + ' ' + x.name, x.id]),
		loadList: () => {
			if(ts() > remoteData.Days.remoteInterval + remoteData.Days.lastRemoteLoad) remoteData.Days.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Days.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Days",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Days))
				.catch(reloadAndLog(remoteData.Days))
		}
	},
	Sets: {
		list: [],
		lastRemoteLoad: 0,
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

		getSuperId: id => remoteData.Sets.getDayId(id),
		getEventName: id => remoteData.Sets.getArtistName(id) + ': ' + remoteData.Festivals.getEventName(remoteData.Sets.getFestivalId(id)),
		getEventNames: () => remoteData.Sets.list.map(x => remoteData.Sets.getEventName(x.id)),
		getEventNamesWithIds: superId => remoteData.Sets.list
			.filter(e => !superId || e.day === superId)
			.map(x => [remoteData.Sets.getEventName(x.id), x.id]),
		loadList: () => {
			if(ts() > remoteData.Sets.remoteInterval + remoteData.Sets.lastRemoteLoad) remoteData.Sets.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Sets.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Sets",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Sets))
				.catch(reloadAndLog(remoteData.Sets))
		}
	},
	Venues: {
		list: [],
		lastRemoteLoad: 0,
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
		getPlaceNames: () => remoteData.Venues.list.map(x => x.name),
		getPlaceNamesWithIds: () => remoteData.Venues.list.map(x => [x.name, x.id]),
		
		loadList: () => {
			if(ts() > remoteData.Venues.remoteInterval + remoteData.Venues.lastRemoteLoad) remoteData.Venues.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Venues.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Venues",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Venues))
				.catch(reloadAndLog(remoteData.Venues))
		},
		create: data => {
			const dataFieldName = 'Venues'
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return m.request(reqOptionsCreate(tokenFunction)(dataFieldName)(data))
				.then(forceRemoteLoad(remoteData.Venues))
				.catch(logResult)
		}
	},
	Organizers: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.Organizers.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.rganizers.remoteInterval + remoteData.rganizers.lastRemoteLoad) remoteData.rganizers.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Organizers.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Organizers",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Organizers))
				.catch(reloadAndLog(remoteData.Organizers))
		}
	},
	Places: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Places.list, p => p.id === id),
		getMany: ids => remoteData.Places.list.filter(d => ids.indexOf(d.id) > -1),
		idFields: () => remoteData.Places.list.length ? 
			Object.keys(remoteData.Places.list[0]).filter(idFieldFilter) : 
			[],
		loadList: () => {
			if(ts() > remoteData.Places.remoteInterval + remoteData.Places.lastRemoteLoad) remoteData.Places.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Places.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Places",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Places))
				.catch(reloadAndLog(remoteData.Places))
		}
	},
	Lineups: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.Lineups.list.filter(d => ids.indexOf(d.id) > -1),
		getPriFromArtistFest: (artist, fest) => {
			const target = _.find(remoteData.Lineups.list, p => p.festival === fest && p.band === artist)
			if(!target) return
			return target.priority
		},
		festHasLineup: fest => _.some(remoteData.Lineups.list, l => l.festival === fest),
		getFestivalArtistIds: fest => remoteData.Lineups.list.filter(l => l.festival === fest).map(l => l.band),
		loadList: () => {
			if(ts() > remoteData.Lineups.remoteInterval + remoteData.Lineups.lastRemoteLoad) remoteData.Lineups.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Lineups.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Lineups",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Lineups))
				.catch(reloadAndLog(remoteData.Lineups))
		},
		upload: (data, festivalId) => {
			const dataFieldName = 'Artists/festivalLineup/' + festivalId
			//((assume data was validated in form))
			//((assume server will add user field))
			//submit to server
				//set last remote load to 0
			return m.request(reqOptionsCreate(tokenFunction)(dataFieldName)(data))
				.then(forceRemoteLoad(remoteData.Lineups))
				.then(forceRemoteLoad(remoteData.Artists))
				.catch(logResult)
		}
	},
	ArtistPriorities: {
		list: [],
		lastRemoteLoad: 0,
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
			return m.request({
		    	method: "GET",
		    	url: "/api/ArtistPriorities",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.ArtistPriorities))
				.catch(reloadAndLog(remoteData.ArtistPriorities))
		}
	},
	StagePriorities: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.StagePriorities.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.StagePriorities.remoteInterval + remoteData.StagePriorities.lastRemoteLoad) remoteData.StagePriorities.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.StagePriorities.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/StagePriorities",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.StagePriorities))
				.catch(reloadAndLog(remoteData.StagePriorities))
		}
	},
	StageLayouts: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.StageLayouts.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.StageLayouts.remoteInterval + remoteData.StageLayouts.lastRemoteLoad) remoteData.StageLayouts.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.StageLayouts.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/StageLayouts",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.StageLayouts))
				.catch(reloadAndLog(remoteData.StageLayouts))
		}
	},
	PlaceTypes: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.PlaceTypes.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.PlaceTypes.remoteInterval + remoteData.PlaceTypes.lastRemoteLoad) remoteData.PlaceTypes.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.PlaceTypes.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/PlaceTypes",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.PlaceTypes))
				.catch(reloadAndLog(remoteData.PlaceTypes))
		}
	},
	Artists: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		get: id => _.find(remoteData.Artists.list, p => p.id === id),
		getMany: ids => remoteData.Artists.list.filter(d => ids.indexOf(d.id) > -1),
		getName: id => {
			const data = remoteData.Artists.get(id)
			if(!data) return
			return data.name

		},
		idFields: () => remoteData.Artists.list.length ? 
			Object.keys(remoteData.Artists.list[0]).filter(idFieldFilter) : 
			[],
		loadList: () => {
			if(ts() > remoteData.Artists.remoteInterval + remoteData.Artists.lastRemoteLoad) remoteData.Artists.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Artists.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Artists",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Artists))
				.catch(reloadAndLog(remoteData.Artists))
		}
	},
	ParentGenres: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.ParentGenres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.ParentGenres.remoteInterval + remoteData.ParentGenres.lastRemoteLoad) remoteData.ParentGenres.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.ParentGenres.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/ParentGenres",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.ParentGenres))
				.catch(reloadAndLog(remoteData.ParentGenres))
		}
	},
	Genres: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.Genres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.Genres.remoteInterval + remoteData.Genres.lastRemoteLoad) remoteData.Genres.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Genres.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Genres",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Genres))
				.catch(reloadAndLog(remoteData.Genres))
		}
	},
	ArtistGenres: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.ArtistGenres.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.ArtistGenres.remoteInterval + remoteData.ArtistGenres.lastRemoteLoad) remoteData.ArtistGenres.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.ArtistGenres.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/ArtistGenres",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.ArtistGenres))
				.catch(reloadAndLog(remoteData.ArtistGenres))
		}
	},
	Users: {
		list: [],
		lastRemoteLoad: 0,
		remoteInterval: 86400,
		getMany: ids => remoteData.Users.list.filter(d => ids.indexOf(d.id) > -1),
		loadList: () => {
			if(ts() > remoteData.Users.remoteInterval + remoteData.Users.lastRemoteLoad) remoteData.Users.remoteLoad()

		},
		remoteLoad: () => {
			remoteData.Users.lastRemoteLoad = ts()
			return m.request({
		    	method: "GET",
		    	url: "/api/Users",
		  		config: tokenFunction
			})
				.then(assignDataToList(remoteData.Users))
				.catch(reloadAndLog(remoteData.Users))
		}
	}
}



exports.getMessageData = () => remoteData.Messages.list
exports.getSeriesData = () => remoteData.Series.list
exports.getFestivalData = () => remoteData.Festivals.list
exports.getDateData = () => remoteData.Dates.list
exports.getDayData = () => remoteData.Days.list
exports.getSetData = () => remoteData.Sets.list
exports.getVenueData = () => remoteData.Venues.list
exports.getOrganizerData = () => remoteData.Organizers.list
exports.getPlaceData = () => remoteData.Places.list
exports.getLineupData = () => remoteData.Lineups.list
exports.getArtistPriorityData = () => remoteData.ArtistPriorities.list
exports.getStagePriorityData = () => remoteData.StagePriorities.list
exports.getStageLayoutData = () => remoteData.StageLayouts.list
exports.getPlaceTypeData = () => remoteData.PlaceTypes.list
exports.getArtistData = () => remoteData.Artists.list
exports.getParentGenreData = () => remoteData.ParentGenres.list
exports.getGenreData = () => remoteData.Genres.list
exports.getArtistGenreData = () => remoteData.ArtistGenres.list
exports.getUserData = () => remoteData.Users.list

exports.remoteData = remoteData


exports.getMockData = () => CONFERENCES;
exports.setMockData = (conference) => CONFERENCES.push(conference);
