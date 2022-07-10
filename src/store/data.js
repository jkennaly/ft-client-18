// src/store/data.js

import _ from "lodash"
import m from "mithril"
// Services
import Auth from "../services/auth.js"
const auth = Auth

import { getList } from "./loading/enlist"
import { coreCheck, coreChecked } from "./loading/acquire"

import ArtistList from "./list/models/ArtistList"
import ImageList from "./list/models/ImageList"
import SeriesList from "./list/models/SeriesList"
import FestivalList from "./list/models/FestivalList"
import DateList from "./list/models/DateList"
import DayList from "./list/models/DayList"
import SetList from "./list/models/SetList"
import LineupList from "./list/models/LineupList"
import VenueList from "./list/models/VenueList"
import OrganizerList from "./list/models/OrganizerList"
import PlaceList from "./list/models/PlaceList"
import ArtistPriorityList from "./list/models/ArtistPriorityList"
import StagePriorityList from "./list/models/StagePriorityList"
import StageLayoutList from "./list/models/StageLayoutList"
import PlaceTypeList from "./list/models/PlaceTypeList"
import ArtistAliasList from "./list/models/ArtistAliasList"
import ParentGenreList from "./list/models/ParentGenreList"
import GenreList from "./list/models/GenreList"
import ArtistGenreList from "./list/models/ArtistGenreList"
import MessageTypeList from "./list/models/MessageTypeList"
import SubjectTypeList from "./list/models/SubjectTypeList"
import MessageList from "./list/models/MessageList"
import MessagesMonitorList from "./list/models/MessagesMonitorList"
import IntentionList from "./list/models/IntentionList"
import InteractionList from "./list/models/InteractionList"
import ProfileList from "./list/models/ProfileList"
import FlagList from "./list/models/FlagList"

import appendable from "./list/mixins/local/appendable"
import img from "./list/mixins/attributes/img"
import named from "./list/mixins/attributes/named"
import messageName from "./list/mixins/attributes/messageName"
import userName from "./list/mixins/attributes/userName"
import leveled from "./list/mixins/attributes/leveled"
import pending from "./list/mixins/attributes/pending"
import rated from "./list/mixins/attributes/rated"
import virginal from "./list/mixins/attributes/virginal"
import filterable from "./list/mixins/attributes/filterable"
import subjective from "./list/mixins/subjects/subjective"
import messageCheckin from "./list/mixins/subjects/checkins/message"
import dateCheckin from "./list/mixins/subjects/checkins/dateCheckin"
import setFilters from "./list/mixins/event/admin/setFilters"
import dateFilters from "./list/mixins/event/admin/dateFilters"
import placeAdmin from "./list/mixins/event/admin/place"
import seriesIds from "./list/mixins/event/associated/seriesIds"
import festivalIds from "./list/mixins/event/associated/festivalIds"
import dateIds from "./list/mixins/event/associated/dateIds"
import dayIds from "./list/mixins/event/associated/dayIds"
import setIds from "./list/mixins/event/associated/setIds"
import seriesActive from "./list/mixins/event/active/series"
import festivalActive from "./list/mixins/event/active/festival"
import futureDate from "./list/mixins/event/futureDate"
import futureSet from "./list/mixins/event/futureSet"
import momentsDate from "./list/mixins/event/momentsDate"
import momentsDay from "./list/mixins/event/momentsDay"
import momentsSet from "./list/mixins/event/momentsSet"
import event from "./list/mixins/event/event"
import eventSuper from "./list/mixins/event/eventSuper"
import eventSub from "./list/mixins/event/eventSub"
import sellAccess from "./list/mixins/event/sellAccess"
import placeName from "./list/mixins/subjects/place"
import setName from "./list/mixins/event/setName"
import research from "./list/mixins/event/research"
import intended from "./list/mixins/event/intendedFestival"
import intendedDate from "./list/mixins/event/intendedDate"
import imgEvent from "./list/mixins/event/img"
import messageEventConnections from "./list/mixins/subjects/messageConnections/event"
import messageArtistConnections from "./list/mixins/subjects/messageConnections/artist"
import messageFestivalConnections from "./list/mixins/subjects/messageConnections/festival"
import messageFilters from "./list/mixins/subjects/filters/message"
import forArtist from "./list/mixins/subjects/filters/forArtist"
import forSubject from "./list/mixins/subjects/filters/forSubject"
import forDayAndStage from "./list/mixins/subjects/filters/forDayAndStage"
import monitoredMessageFilters from "./list/mixins/subjects/filters/monitoredMessage"
import connectionFilter from "./list/mixins/subjects/messageConnections/filter"
import nameMatch from "./list/mixins/search/nameMatch"
import artistConnections from "./list/mixins/relations/artistConnections"
import messageMonitor from "./list/mixins/relations/messageMonitor"
import intent from "./list/mixins/relations/intent"
import interact from "./list/mixins/relations/interact"
import interactOptions from "./list/mixins/relations/interactOptions"
import recent from "./list/mixins/relations/recent"
import messageSenders from "./list/mixins/relations/messageSenders"
import senderPurge from "./list/mixins/relations/senderPurge"
import merge from "./list/mixins/remote/merge"
import subjectDetails from "./list/mixins/remote/details/subject"
import artistDetails from "./list/mixins/remote/details/artist"
import dateDetails from "./list/mixins/remote/details/date"
import dayDetails from "./list/mixins/remote/details/day"
import flagDetails from "./list/mixins/remote/details/flag"
import setDetails from "./list/mixins/remote/details/set"
import festivalDetails from "./list/mixins/remote/details/festival"
import messageDetails from "./list/mixins/remote/details/message"
import userDetails from "./list/mixins/remote/details/user"
import wiki from "./list/mixins/remote/www/getWikiPromise"
import advanceFlag from "./list/mixins/remote/advanceFlag"
import batchCreate from "./list/mixins/remote/batchCreate"
import batchDelete from "./list/mixins/remote/batchDelete"
import batchUpdate from "./list/mixins/remote/batchUpdate"
import bucks from "./list/mixins/remote/bucks"
import cloudy from "./list/mixins/remote/cloudy"
import cost from "./list/mixins/remote/cost"
import buy from "./list/mixins/remote/buy"
import create from "./list/mixins/remote/create"
import deletion from "./list/mixins/remote/deletion"
import dateWithDays from "./list/mixins/remote/dateWithDays"
import festivalMessages from "./list/mixins/remote/festivalMessages"
import getPromise from "./list/mixins/remote/getPromise"
import nameSearch from "./list/mixins/remote/nameSearch"
import setsForDay from "./list/mixins/remote/setsForDay"
import update from "./list/mixins/remote/update"
import updateInstance from "./list/mixins/remote/updateInstance"
import uploadLineupArtists from "./list/mixins/remote/uploadLineupArtists"
import upsert from "./list/mixins/remote/upsert"
import localforage from "localforage"

let dataLoad = Promise.resolve(false)

let artists = new ArtistList()
let images = new ImageList()
let series = new SeriesList()
let festivals = new FestivalList()
let dates = new DateList()
let days = new DayList()
let sets = new SetList()
let lineups = new LineupList()
let venues = new VenueList()
let organizers = new OrganizerList()
let places = new PlaceList()
let artistPriorities = new ArtistPriorityList()
let stagePriorities = new StagePriorityList()
let stageLayouts = new StageLayoutList()
let placeTypes = new PlaceTypeList()
let artistAliases = new ArtistAliasList()
let parentGenres = new ParentGenreList()
let genres = new GenreList()
let artistGenres = new ArtistGenreList()
let messageTypes = new MessageTypeList()
let subjectTypes = new SubjectTypeList()
let messages = new MessageList()
let messagesMonitors = new MessagesMonitorList()
let intentions = new IntentionList()
let interactions = new InteractionList()
let users = new ProfileList()
let flags = new FlagList()

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
	profiles: users,
	images: images,
	flags: flags
}

Object.assign(
	artists,
	filterable,
	appendable,
	named,
	rated(messages),
	virginal(messages, festivals, lineups),
	subjective,
	nameMatch,
	messageArtistConnections(subjects),
	merge,
	update,
	getPromise,
	wiki,
	nameSearch,
	artistDetails(
		subjects,
		lineups,
		images,
		artistAliases,
		genres,
		artistGenres,
		parentGenres,
		artistPriorities
	)
)
Object.assign(
	images,
	filterable,
	img,
	forSubject,
	getPromise,
	subjectDetails,
	create,
	messageName(subjects),
	imgEvent(subjects, lineups),
	cloudy
)
Object.assign(
	series,
	filterable,
	subjective,
	event,
	eventSub(festivals),
	sellAccess(festivals),
	messageEventConnections,
	seriesIds(subjects),
	nameMatch,
	seriesActive(dates),
	create,
	updateInstance,
	getPromise,
	wiki,
	subjectDetails
)
Object.assign(
	festivals,
	filterable,
	subjective,
	event,
	eventSub(dates),
	sellAccess(dates),
	eventSuper(series),
	messageFestivalConnections(messages, lineups),
	research(artists, messages, lineups, artistPriorities),
	festivalActive(dates),
	intended(intentions, dates),
	create,
	festivalIds(subjects),
	getPromise,
	wiki,
	cost,
	buy,
	festivalDetails(
		subjects,
		lineups,
		images,
		artistAliases,
		genres,
		artistGenres,
		parentGenres,
		artistPriorities,
		intentions
	)
)
Object.assign(
	dates,
	filterable,
	subjective,
	momentsDate(days, venues),
	futureDate,
	event,
	eventSub(days),
	sellAccess(days),
	eventSuper(festivals),
	messageEventConnections,
	dateIds(subjects, lineups),
	dateCheckin(messages),
	dateWithDays(days),
	dateFilters(festivals),
	getPromise,
	wiki,
	cost,
	buy,
	dateDetails(subjects, lineups, intentions),
	intendedDate(intentions)
)
Object.assign(
	days,
	filterable,
	event,
	eventSub(sets),
	sellAccess(),
	eventSuper(dates),
	momentsDay(dates),
	messageEventConnections,
	futureDate,
	dayIds(subjects),
	getPromise,
	wiki,
	cost,
	buy,
	dayDetails(subjects)
)
Object.assign(
	sets,
	filterable,
	subjective,
	event,
	setName(artists),
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
	deletion,
	getPromise,
	forDayAndStage,
	futureSet,
	setDetails(subjects)
)
Object.assign(
	lineups,
	filterable,
	appendable,
	artistConnections(artistPriorities, artists, festivals),
	create,
	updateInstance,
	deletion,
	uploadLineupArtists(artists),
	batchDelete,
	getPromise,
	batchUpdate
)
Object.assign(
	venues,
	filterable,
	subjective,
	named,
	messageEventConnections,
	placeName,
	create,
	getPromise,
	wiki,
	subjectDetails
)
Object.assign(organizers, getPromise, filterable)
Object.assign(
	places,
	filterable,
	subjective,
	named,
	messageEventConnections,
	batchCreate,
	batchDelete,
	placeAdmin(series, festivals),
	getPromise,
	subjectDetails
)
Object.assign(artistPriorities, filterable, leveled, getPromise, named)
Object.assign(stagePriorities, getPromise, filterable)
Object.assign(stageLayouts, getPromise, filterable)
Object.assign(placeTypes, getPromise, filterable)
Object.assign(artistAliases, filterable, batchCreate, batchDelete, getPromise, forArtist)
Object.assign(parentGenres, getPromise, filterable)
Object.assign(genres, getPromise, filterable)
Object.assign(artistGenres, getPromise, filterable)
Object.assign(
	messages,
	getPromise,
	filterable,
	subjective,
	messageName(subjects),
	messageEventConnections,
	connectionFilter(subjects),
	messageFilters,
	monitoredMessageFilters(messagesMonitors),
	festivalMessages(festivals, lineups),
	create,
	upsert,
	updateInstance,
	deletion,
	senderPurge,
	messageDetails(subjects),
	messageCheckin(subjects),
	messageSenders(users)
)
Object.assign(
	messagesMonitors,
	getPromise,
	filterable,
	messageMonitor,
	create,
	batchCreate,
	batchDelete
)
Object.assign(
	intentions,
	getPromise,
	filterable,
	forSubject,
	create,
	batchCreate,
	batchDelete,
	updateInstance,
	deletion,
	intent
)
Object.assign(
	interactions,
	getPromise,
	filterable,
	create,
	updateInstance,
	deletion,
	interact(messages)
)
Object.assign(
	users,
	getPromise,
	filterable,
	subjective,
	userName,
	nameSearch,
	messageEventConnections,
	userDetails(interactions),
	updateInstance,
	interactOptions(interactions),
	recent(messages),
	bucks,
	buy,
	cost
)
Object.assign(
	flags,
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
	"Artists",
	"Images",
	"Series",
	"Festivals",
	"Dates",
	"Days",
	"Sets",
	"Lineups",
	"Venues",
	"Organizers",
	"Places",
	"ArtistPriorities",
	"StagePriorities",
	"StageLayouts",
	"PlaceTypes",
	"ArtistAliases",
	"ParentGenres",
	"Genres",
	"ArtistGenres",
	"MessageTypes",
	"SubjectTypes",
	"Intentions"
]
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
	Interactions: interactions,
	Users: users,
	Flags: flags
	/*
	dataLoad: window.mockery
		? Promise.resolve(true)
		: Promise.all(
				_.map(baseKeys, k =>
					getList(k).then(l => remoteData[k].replaceList(l))
				)
		  )
				//.then(l => console.log(`list ${k}`, l.length) || l)
				//.then(() => console.log('artist list length ' + remoteData.Artists.list.length))
				.catch(console.error)
				.then(() => true),
	*/
}

window.festigram = _.assign({}, remoteData)
festigram.auth = auth
festigram.build = new Date(BUILD_TIME)
const coreKeys = _.keys(remoteData).filter(k => remoteData[k].core)
//console.log("coreKeys", coreKeys)
coreChecked
	.then(coreData =>
		//console.log("coreData", coreData) ||
		Promise.all(
			_.map(coreData, (l, k) => {
				//console.log("code data list", k, l)
				return remoteData[k] && remoteData[k].replaceList(l)
			})
		)
	)
	.then(() => m.redraw())
	.catch(console.error)


export const clearData = () => {
	_.each(remoteData, dataField => dataField.clear && dataField.clear())
	_.each(remoteData, dataField => dataField.clearCaches && dataField.clearCaches())
	if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
		//console.log("auth.logout: sw found", swCacheClear)
		var cacheWhitelist = []
		caches.keys().then(cacheName => {
			const precache = /precache/.test(cacheName)
			const font = precache || /fonts/.test(cacheName)
			const img = font || /cloud-image/.test(cacheName)
			const save = img || cacheWhitelist.indexOf(cacheName) > -1
			return save ? caches.delete(cacheName) : Promise.resolve(true)
		}
		)
	}

	//init the lists with core data

	coreCheck()
		.then(localforage.clear)
		.then(coreData =>
			Promise.all(
				_.map(coreData, (l, k) => {
					console.log("code data list", k, l)
					if (!remoteData[k]) return []
					return remoteData[k].replaceList(l)
				})
			)
		)
		.then(() => m.redraw())
		.catch(console.error)

	//.then(() => console.log('artist list length ' + remoteData.Artists.list.length))
}

export const clearCaches = () => {
	//init the lists with core data
	//.then(() => console.log('artist list length ' + remoteData.Artists.list.length))
}

auth.cacheCleaner(clearData)

if (!window.mockery) {
	//init the lists with core data
	//remoteData.dataLoad
	//.then(() => console.log('data loaded', remoteData.Artists.list.length))
	new Promise((resolve, reject) => {
		let wait = setTimeout(() => {
			//clearTimout(wait)
		}, 10000)
	})
		.then(() => {
			const interval = 5000
			const updateInterval = setTimeout(function run() {
				//console.log('update')
				Promise.all(
					_.map(remoteData, v => v.core && v.remoteCheck && v.remoteCheck())
				)
					.catch(console.error)
					.then(() => setTimeout(run, interval))
			}, interval)
		})
		.catch(console.error)
} else {
	dataLoad = Promise.resolve(true)
}
