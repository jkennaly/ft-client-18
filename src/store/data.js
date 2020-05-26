// src/store/data.js

import _ from 'lodash'
import m from 'mithril'
// Services
import Auth from '../services/auth.js';
const auth = new Auth();

import {getList} from './loading/enlist'
import {coreCheck} from './loading/acquire'

import MessageList from './list/models/MessageList'
import FlagList from './list/models/FlagList'
import ImageList from './list/models/ImageList'
import ProfileList from './list/models/ProfileList'


import appendable from './list/mixins/local/appendable'
import img from './list/mixins/attributes/img'
import named from './list/mixins/attributes/named'
import messageName from './list/mixins/attributes/messageName'
import userName from './list/mixins/attributes/userName'
import leveled from './list/mixins/attributes/leveled'
import pending from './list/mixins/attributes/pending'
import rated from './list/mixins/attributes/rated'
import virginal from './list/mixins/attributes/virginal'
import filterable from './list/mixins/attributes/filterable'
import subjective from './list/mixins/subjects/subjective'
import messageCheckin from './list/mixins/subjects/checkins/message'
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
import futureDate from './list/mixins/event/futureDate'
import futureSet from './list/mixins/event/futureSet'
import momentsDate from './list/mixins/event/momentsDate'
import momentsDay from './list/mixins/event/momentsDay'
import momentsSet from './list/mixins/event/momentsSet'
import event from './list/mixins/event/event'
import eventSuper from './list/mixins/event/eventSuper'
import eventSub from './list/mixins/event/eventSub'
import placeName from './list/mixins/subjects/place'
import setName from './list/mixins/event/setName'
import research from './list/mixins/event/research'
import intended from './list/mixins/event/intendedFestival'
import intendedDate from './list/mixins/event/intendedDate'
import imgEvent from './list/mixins/event/img'
import messageEventConnections from './list/mixins/subjects/messageConnections/event'
import messageArtistConnections from './list/mixins/subjects/messageConnections/artist'
import messageFestivalConnections from './list/mixins/subjects/messageConnections/festival'
import messageFilters from './list/mixins/subjects/filters/message'
import forArtist from './list/mixins/subjects/filters/forArtist'
import forSubject from './list/mixins/subjects/filters/forSubject'
import forDayAndStage from './list/mixins/subjects/filters/forDayAndStage'
import monitoredMessageFilters from './list/mixins/subjects/filters/monitoredMessage'
import connectionFilter from './list/mixins/subjects/messageConnections/filter'
import nameMatch from './list/mixins/search/nameMatch'
import artistConnections from './list/mixins/relations/artistConnections'
import messageMonitor from './list/mixins/relations/messageMonitor'
import intent from './list/mixins/relations/intent'
import interact from './list/mixins/relations/interact'
import interactOptions from './list/mixins/relations/interactOptions'
import merge from './list/mixins/remote/merge'
import subjectDetails from './list/mixins/remote/details/subject'
import artistDetails from './list/mixins/remote/details/artist'
import dateDetails from './list/mixins/remote/details/date'
import dayDetails from './list/mixins/remote/details/day'
import flagDetails from './list/mixins/remote/details/flag'
import setDetails from './list/mixins/remote/details/set'
import festivalDetails from './list/mixins/remote/details/festival'
import messageDetails from './list/mixins/remote/details/message'
import advanceFlag from './list/mixins/remote/advanceFlag'
import batchCreate from './list/mixins/remote/batchCreate'
import batchDelete from './list/mixins/remote/batchDelete'
import batchUpdate from './list/mixins/remote/batchUpdate'
import create from './list/mixins/remote/create'
import deletion from './list/mixins/remote/deletion'
import dateWithDays from './list/mixins/remote/dateWithDays'
import festivalMessages from './list/mixins/remote/festivalMessages'
import getPromise from './list/mixins/remote/getPromise'
import nameSearch from './list/mixins/remote/nameSearch'
import setsForDay from './list/mixins/remote/setsForDay'
import update from './list/mixins/remote/update'
import updateInstance from './list/mixins/remote/updateInstance'
import uploadLineupArtists from './list/mixins/remote/uploadLineupArtists'
import upsert from './list/mixins/remote/upsert'

let dataLoad = Promise.resolve(false)

let images =  new ImageList()
let messages =  new MessageList()
let users =  new ProfileList()
let flags =  new FlagList()


const subjects = {
    messages: messages,
    profiles: users,
    images: images,
    flags: flags
}

Object.assign(images,
	filterable,
	img,
	forSubject,
	getPromise,
	subjectDetails,
	create,
	messageName(subjects)
)
Object.assign(messages,
	getPromise,
	filterable,
	subjective,
	messageName(subjects),
	messageEventConnections,
	connectionFilter(subjects),
	messageFilters,
	festivalMessages,
	create,
	upsert,
	updateInstance,
	messageDetails(subjects),
	messageCheckin(subjects)
)
Object.assign(users,
	getPromise,
	filterable,
	subjective,
	userName,
	messageEventConnections,
	subjectDetails
)
Object.assign(flags,
	getPromise,
	filterable,
	subjective,
	create,
	flagDetails(messages),
	pending(messages),
	advanceFlag,
	messageName(subjects)
)
const baseKeys = [
'Images',
]
export const remoteData = {
	Images: images,
	Messages: messages,
	Users: users,
	Flags: flags,
	dataLoad: window.mockery ? Promise.resolve(true) : (Promise.all(
		_.map(baseKeys, 
			k => getList(k)
				.then(l => remoteData[k].replaceList(l))))
				//.then(l => console.log(`list ${k}`, l.length) || l)
		//.then(() => console.log('artist list length ' + remoteData.Artists.list.length))
		.catch(console.error)
		.then(() => true)
	),

}

global.festigram = _.assign({}, remoteData)
festigram.auth = auth

export const clearData = () => {
	_.each(remoteData, dataField => dataField.clear && dataField.clear())
	//init the lists with core data
	const keys = _.keys(remoteData).filter(k => remoteData[k].core)
	coreCheck()
		.then(() => Promise.all(_.map(keys, k => getList(k).then(l => remoteData[k].replaceList(l)))))
		.then(() => m.redraw())
	
		//.then(() => console.log('artist list length ' + remoteData.Artists.list.length))
	
}

auth.recore(clearData)

if(!window.mockery) {
	//init the lists with core data
	remoteData.dataLoad
		//.then(() => console.log('data loaded', remoteData.Artists.list.length))
		.then(() => {

			const interval = 5000
			const updateInterval = setTimeout(function run() {
				//console.log('update')
				Promise.all(_.map(remoteData, v => v.core && v.remoteCheck && v.remoteCheck()))
					.catch(console.error)
					.then(() => setTimeout(run, interval))
			}, interval)
		})
} else {
	dataLoad = Promise.resolve(true)
}
