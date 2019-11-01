// data2.js

import _ from 'lodash'
import m from 'mithril'

import {getList} from './loading/enlist'

import ArtistList from './list/models/ArtistList'
import ImageList from './list/models/ImageList'
import SeriesList from './list/models/SeriesList'
import FestivalList from './list/models/FestivalList'
import DateList from './list/models/DateList'
import DayList from './list/models/DayList'
import SetList from './list/models/SetList'
import LineupList from './list/models/LineupList'
import VenueList from './list/models/VenueList'
import OrganizerList from './list/models/OrganizerList'
import PlaceList from './list/models/PlaceList'
import ArtistPriorityList from './list/models/ArtistPriorityList'
import StagePriorityList from './list/models/StagePriorityList'
import StageLayoutList from './list/models/StageLayoutList'
import PlaceTypeList from './list/models/PlaceTypeList'
import ArtistAliasList from './list/models/ArtistAliasList'
import ParentGenreList from './list/models/ParentGenreList'
import GenreList from './list/models/GenreList'
import ArtistGenreList from './list/models/ArtistGenreList'
import MessageTypeList from './list/models/MessageTypeList'
import SubjectTypeList from './list/models/SubjectTypeList'
import MessageList from './list/models/MessageList'
import MessagesMonitorList from './list/models/MessagesMonitorList'
import IntentionList from './list/models/IntentionList'
import ProfileList from './list/models/ProfileList'


import appendable from './list/mixins/local/appendable'
import img from './list/mixins/attributes/img'
import named from './list/mixins/attributes/named'
import messageName from './list/mixins/attributes/messageName'
import userName from './list/mixins/attributes/userName'
import leveled from './list/mixins/attributes/leveled'
import rated from './list/mixins/attributes/rated'
import virginal from './list/mixins/attributes/virginal'
import filterable from './list/mixins/attributes/filterable'
import subjective from './list/mixins/subjects/subjective'
import dateCheckin from './list/mixins/subjects/checkins/dateCheckin'
import setFilters from './list/mixins/event/admin/setFilters'
import dateFilters from './list/mixins/event/admin/dateFilters'
import placeAdmin from './list/mixins/event/admin/place'
import seriesIds from './list/mixins/event/associated/seriesIds'
import festivalIds from './list/mixins/event/associated/festivalIds'
import dateIds from './list/mixins/event/associated/dateIds'
import dayIds from './list/mixins/event/associated/dayIds'
import setIds from './list/mixins/event/associated/setIds'
import seriesActive from './list/mixins/event/active/series'
import festivalActive from './list/mixins/event/active/festival'
import futureFestival from './list/mixins/event/futureFestival'
import futureDate from './list/mixins/event/futureDate'
import momentsDate from './list/mixins/event/momentsDate'
import momentsDay from './list/mixins/event/momentsDay'
import momentsSet from './list/mixins/event/momentsSet'
import event from './list/mixins/event/event'
import eventSuper from './list/mixins/event/eventSuper'
import eventSub from './list/mixins/event/eventSub'
import placeName from './list/mixins/subjects/place'
import setName from './list/mixins/event/setName'
import research from './list/mixins/event/research'
import intended from './list/mixins/event/intended'
import messageEventConnections from './list/mixins/subjects/messageConnections/event'
import messageArtistConnections from './list/mixins/subjects/messageConnections/artist'
import messageFilters from './list/mixins/subjects/filters/message'
import forArtist from './list/mixins/subjects/filters/forArtist'
import forSubject from './list/mixins/subjects/filters/forSubject'
import monitoredMessageFilters from './list/mixins/subjects/filters/monitoredMessage'
import connectionFilter from './list/mixins/subjects/messageConnections/filter'
import nameMatch from './list/mixins/search/nameMatch'
import artistConnections from './list/mixins/relations/artistConnections'
import messageMonitor from './list/mixins/relations/messageMonitor'
import intent from './list/mixins/relations/intent'
import dateLineups from './list/mixins/relations/dateLineups'
import merge from './list/mixins/remote/merge'
import batchCreate from './list/mixins/remote/batchCreate'
import batchDelete from './list/mixins/remote/batchDelete'
import batchUpdate from './list/mixins/remote/batchUpdate'
import create from './list/mixins/remote/create'
import deletion from './list/mixins/remote/deletion'
import dateWithDays from './list/mixins/remote/dateWithDays'
import festivalMessages from './list/mixins/remote/festivalMessages'
import setsForDay from './list/mixins/remote/setsForDay'
import update from './list/mixins/remote/update'
import updateInstance from './list/mixins/remote/updateInstance'
import uploadLineupArtists from './list/mixins/remote/uploadLineupArtists'
import upsert from './list/mixins/remote/upsert'

let artists =  new ArtistList()
let images =  new ImageList()
let series =  new SeriesList()
let festivals =  new FestivalList()
let dates =  new DateList()
let days =  new DayList()
let sets =  new SetList()
let lineups =  new LineupList()
let venues =  new VenueList()
let organizers =  new OrganizerList()
let places =  new PlaceList()
let artistPriorities =  new ArtistPriorityList()
let stagePriorities =  new StagePriorityList()
let stageLayouts =  new StageLayoutList()
let placeTypes =  new PlaceTypeList()
let artistAliases =  new ArtistAliasList()
let parentGenres =  new ParentGenreList()
let genres =  new GenreList()
let artistGenres =  new ArtistGenreList()
let messageTypes =  new MessageTypeList()
let subjectTypes =  new SubjectTypeList()
let messages =  new MessageList()
let messagesMonitors =  new MessagesMonitorList()
let intentions =  new IntentionList()
let users =  new ProfileList()


const subjects = {
	series: series,
    festivals: festivals,
    dates: dates,
    days: days,
    sets: sets,
    artists: artists,
    venues: venues,
    places: places,
    messages: messages,
    profiles: users
}


Object.assign(artists,
	filterable,
	appendable,
	named,
	rated(messages),
	virginal(messages, festivals, lineups),
	subjective,
	nameMatch,
	messageArtistConnections(subjects),
	merge,
	update
)
Object.assign(images,
	filterable,
	img,
	forSubject
)
Object.assign(series,
	filterable,
	subjective,
	event,
	eventSub(festivals),
	messageEventConnections,
	seriesIds(subjects),
	nameMatch,
	seriesActive(dates),
	create,
	updateInstance
)
Object.assign(festivals,
	filterable,
	subjective,
	futureFestival(dates),
	event,
	eventSub(dates),
	eventSuper(series),
	messageEventConnections,
	research(artists, messages, lineups, artistPriorities),
	intended(intentions),
	create,
	festivalActive(dates),
	festivalIds(subjects)
)
Object.assign(dates,
	filterable,
	subjective,
	momentsDate(venues),
	futureDate,
	event,
	eventSub(days),
	eventSuper(festivals),
	messageEventConnections,
	dateIds(subjects),
	dateLineups(lineups),
	dateCheckin(messages),
	dateWithDays(days),
	dateFilters(festivals)
)
Object.assign(days,
	filterable,
	event,
	eventSub(sets),
	eventSuper(dates),
	momentsDay(dates),
	messageEventConnections,
	futureDate,
	dayIds(subjects)
)
Object.assign(sets,
	filterable,
	subjective,
	setName(artists),
	event,
	eventSuper(days),
	momentsSet(days),
	messageEventConnections,
	setIds(subjects),
	setFilters(dates, festivals, lineups),
	setsForDay,
	batchCreate,
	batchDelete,
	batchUpdate,
	upsert,
	deletion
)
Object.assign(lineups,
	filterable,
	appendable,
	artistConnections(artistPriorities, artists, festivals),
	create,
	uploadLineupArtists(artists),
	batchDelete,
	batchUpdate
)
Object.assign(venues,
	filterable,
	subjective,
	named,
	messageEventConnections,
	placeName,
	create
)
Object.assign(organizers,
	filterable
)
Object.assign(places,
	filterable,
	subjective,
	named,
	messageEventConnections,
	batchCreate,
	batchDelete,
	placeAdmin(series, festivals)
)
Object.assign(artistPriorities,
	filterable,
	leveled,
	named
)
Object.assign(stagePriorities,
	filterable
)
Object.assign(stageLayouts,
	filterable
)
Object.assign(placeTypes,
	filterable
)
Object.assign(artistAliases,
	filterable,
	batchCreate,
	batchDelete,
	forArtist
)
Object.assign(parentGenres,
	filterable
)
Object.assign(genres,
	filterable
)
Object.assign(artistGenres,
	filterable
)
Object.assign(messages,
	filterable,
	subjective,
	messageName(subjects),
	messageEventConnections,
	connectionFilter(subjects),
	messageFilters,
	monitoredMessageFilters(messagesMonitors),
	festivalMessages,
	create,
	upsert,
	updateInstance
)
Object.assign(messagesMonitors,
	filterable,
	messageMonitor,
	create,
	batchCreate,
	batchDelete
)
Object.assign(intentions,
	filterable,
	forSubject,
	create,
	batchCreate,
	batchDelete,
	intent
)
Object.assign(users,
	filterable,
	subjective,
	userName,
	messageEventConnections
)

export const remoteData = {
	Artists: artists,
	Images: images,
	Series: series,
	Festivals: festivals,
	Dates: dates,
	Days: days,
	Sets: sets,
	Lineups: lineups,
	Venues: venues,
	Organizers: organizers,
	Places: places,
	ArtistPriorities: artistPriorities,
	StagePriorities: stagePriorities,
	StageLayouts: stageLayouts,
	PlaceTypes: placeTypes,
	ArtistAliases: artistAliases,
	ParentGenres: parentGenres,
	Genres: genres,
	ArtistGenres: artistGenres,
	MessageTypes: messageTypes,
	SubjectTypes: subjectTypes,
	Messages: messages,
	MessagesMonitors: messagesMonitors,
	Intentions: intentions,
	Users: users
}

global.festigram = remoteData

export const clearData = () => {
	_.each(remoteData, dataField => dataField.clear())
}

if(!window.mockery) {
	//init the lists with core data
	const keys = _.keys(remoteData).filter(k => remoteData[k].core)
	Promise.all(_.map(keys, k => getList(k).then(l => remoteData[k].replaceList(l))))
		//.then(() => console.log('artist list length ' + remoteData.Artists.list.length))
		.then(m.redraw)
	
}
