// data2.js

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
import named from './list/mixins/attributes/named'
import messageName from './list/mixins/attributes/messageName'
import userName from './list/mixins/attributes/userName'
import leveled from './list/mixins/attributes/leveled'
import rated from './list/mixins/attributes/rated'
import filterable from './list/mixins/attributes/filterable'
import subjective from './list/mixins/subjects/subjective'
import futureFestival from './list/mixins/event/futureFestival'
import futureDate from './list/mixins/event/futureDate'
import momentsDate from './list/mixins/event/momentsDate'
import momentsSet from './list/mixins/event/momentsSet'
import event from './list/mixins/event/event'
import eventSuper from './list/mixins/event/eventSuper'
import eventSub from './list/mixins/event/eventSub'
import setName from './list/mixins/event/setName'
import messageEventConnections from './list/mixins/subjects/messageConnections/event'
import messageArtistConnections from './list/mixins/subjects/messageConnections/artist'
import messageFilters from './list/mixins/subjects/filters/message'
import messagesMonitorFilters from './list/mixins/subjects/filters/messagesMonitor'
import monitoredMessageFilters from './list/mixins/subjects/filters/monitoredMessage'
import connectionFilter from './list/mixins/subjects/messageConnections/filter'
import nameMatch from './list/mixins/search/nameMatch'
import artistConnections from './list/mixins/relations/artistConnections'

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
		Series: series,
        Festivals: festivals,
        Dates: dates,
        Days: days,
        Sets: sets,
        Artists: artists,
        Venues: venues,
        Places: places,
        Messages: messages,
        Profiles: profiles
	}


Object.assign(artists,
	filterable,
	appendable,
	named,
	rated(messages),
	virginal(messages, festivals, lineups),
	subjective,
	nameMatch,
	messageArtistConnections(subjects)
)
Object.assign(images,
	filterable
)
Object.assign(series,
	filterable,
	subjective,
	event,
	eventSub(festivals),
	messageEventConnections
)
Object.assign(festivals,
	filterable,
	subjective,
	futureFestival(dates),
	event,
	eventSub(dates),
	eventSuper(series),
	messageEventConnections
)
Object.assign(dates,
	filterable,
	subjective,
	momentsDate(venues),
	futureDate,
	event,
	eventSub(days),
	eventSuper(festivals),
	messageEventConnections
)
Object.assign(days,
	filterable,
	event,
	eventSub(sets),
	eventSuper(dates),
	messageEventConnections
)
Object.assign(sets,
	filterable,
	subjective,
	setName(artists),
	event,
	eventSuper(days),
	momentsSet(days),
	messageEventConnections
)
Object.assign(lineups,
	filterable,
	artistConnections(artistPriorities)
)
Object.assign(venues,
	filterable,
	subjective,
	named,
	messageEventConnections
)
Object.assign(organizers,
	filterable
)
Object.assign(places,
	filterable,
	subjective,
	named,
	messageEventConnections
)
Object.assign(artistPriorities,
	filterable,
	leveled
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
	filterable
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
Object.assign(messageTypes,
	filterable
)
Object.assign(subjectTypes,
	filterable
)
Object.assign(messages,
	filterable,
	subjective,
	messageName(subjects),
	messageEventConnections,
	connectionFilter(subjects),
	messageFilters,
	monitoredMessageFilters(messagesMonitors)
)
Object.assign(messagesMonitors,
	filterable,
	messagesMonitorFilters
)
Object.assign(intentions,
	filterable
)
Object.assign(users,
	filterable,
	subjective,
	userName,
	messageEventConnections
)

export const remoteData: {
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

export const clearData = () => {
	_.each(remoteData, dataField => dataField.clear())
}

var initDataPromiseCache = false
const defaultOptions = {
	skipRedraw: true,
	debug: false,
	forceRedraw: false
}
export const initData = (options = defaultOptions) => {
	if(!initDataPromiseCache) {
		clearData()
		const promise = Promise.all(_.keys(remoteData)
			.map(dataFieldName => remoteData[dataFieldName].remoteCheck())
		)
			//.then(() => console.log('redraw prepped'))
			.then(() => m.redraw())
			//.then(() => console.log('redraw launched'))
		initDataPromiseCache = promise

	}
	return initDataPromiseCache

}