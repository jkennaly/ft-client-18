// src/components/fields/ComposedNameField.jsx

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data';

const nameReduce = targetId => (n, s) => n.length || s.id !== targetId ? n : s.name
const yearReduce = targetId => (n, s) => n.length || s.id !== targetId ? n : s.year
const fieldReduce = (targetId, field) => (n, s) => (_.isNumber(n) && n) || (_.isString(n) && n.length) || s.id !== targetId ? n : s[field]

const idFinder = [
	() => 0,
	(ar, id) => ar.reduce(fieldReduce(id, 'series'), 0),
	(ar, id) => ar.reduce(fieldReduce(id, 'festival'), 0),
	(ar, id) => ar.reduce(fieldReduce(id, 'date'), 0),
	(ar, id) => ar.reduce(fieldReduce(id, 'day'), 0),
	(ar, id) => ar.reduce(fieldReduce(id, 'set'), 0)
]

const getEventName = _.memoize((id, eventAr, suffix) => {
	if(!eventAr) return suffix
	const remainingIterations = eventAr.length - 1
	if(!eventAr.length) return suffix
	if(!id) return suffix
	const nextData = eventAr[remainingIterations]
	const festivalNameBase = nextData.reduce(fieldReduce(id, 'year'), '')
	//if(eventAr.length === 2) console.log('id: ' + id)
	//if(eventAr.length === 2) console.log('eventAr[1]: ' + eventAr[1])
	//if(eventAr.length === 2) console.log('nextData[0]: ' + nextData[0])
	//if(eventAr.length === 2) console.log('festivalNameBase: ' + festivalNameBase)
	//if(eventAr.length === 2) console.log('suffix: ' + suffix)
	if(eventAr.length === 2) return getEventName(idFinder[remainingIterations](nextData, id), eventAr.slice(0, -1), festivalNameBase + ' ' + suffix)
	if(eventAr.length === 5) return getEventName(idFinder[remainingIterations](nextData, id), eventAr.slice(0, -1), nextData.reduce(fieldReduce(id, 'band'), 0) + ' ' + suffix)
	const eventNameBase = nextData.reduce(fieldReduce(id, 'name'), '')
	return getEventName(idFinder[remainingIterations](nextData, id), eventAr.slice(0, -1), eventNameBase + ' ' + suffix)
	
}, (i, e, s) => '' + i + '-' + s)



const EventNameField = {
	view: ({ attrs }) =>
		<span class="ft-field">
			{getEventName(attrs.superId, attrs.eventTier, attrs.nameFrag)}
		</span >
};

export default EventNameField;