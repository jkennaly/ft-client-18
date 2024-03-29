// src/components/detailViewsPregame/DayDetail.jsx


import m from 'mithril'
import _ from 'lodash'
// Services
import Auth from '../../services/auth.js';
const auth = Auth;

import DateCard from '../../components/cards/DateCard.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import { remoteData } from '../../store/data';
import { subjectData } from '../../store/subjectData'


import DaySchedule from '../layout/DaySchedule.jsx'
import globals from '../../services/globals';

const sets = remoteData.Sets
const dates = remoteData.Dates
const days = remoteData.Days
const festivals = remoteData.Festivals
const places = remoteData.Places

const event = () => {
	return {
		subject: parseInt(attrs.id, 10),
		subjectType: globals.DAY
	}
}
const id = () => parseInt(m.route.param('id'), 10)
const setsD = (yid = id()) => sets.getFiltered(s => s.day === yid)
const stages = () => places.getMany(
	_.uniq(setsD().map(s => s.stage)))
	.sort((a, b) => a.priority - b.priority)
const festivalId = (yid = id()) => days.getFestivalId(yid)


const DayDetail = {
	name: 'DayDetail',
	preload: (rParams) => {
		//console.log('dayDetails preload')
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const dayId = parseInt(rParams.id, 10)
		//messages.forArtist(dayId)
		//console.log('Research preload', seriesId, festivalId, rParams)
		if (dayId) return days.subjectDetails({ subject: dayId, subjectType: globals.DAY })
	},
	oninit: ({ attrs }) => {
		//console.log('dayDetails init')
		const dayId = id()
		const so = { subject: dayId, subjectType: globals.DAY }
		attrs.focusSubject(so)
		const decoded = attrs.auth.gtt()
		const accessible = decoded && !days.sellAccess(dayId, decoded)
		const evtString = accessible ? 'hasAccess' : 'noAccess'
		attrs.eventSet(evtString)

	},
	oncreate: ({ dom }) => {
		const height = dom.clientHeight
		//console.log('ArtistDetail DOM height', height)
		const scroller = dom.querySelector('.ft-schedule')
		if (!scroller) return
		scroller.style['height'] = `${height - 270}px`
		scroller.style['flex-grow'] = 0

	},
	view: () => <div class="main-stage">


		{
			//console.log(`DayDetail sets ${days.getDateId(id())}`, id(), setsD().map(s => s.stage))
		}
		{days.getDateId(id()) ?
			<DateCard eventId={days.getDateId(id())} />
			: ''}

		{days.getDateId(id()) ?
			<DaySchedule
				dateId={days.getDateId(id())}
				dayId={id()}
				sets={setsD()}
				stages={stages()}
			/> : ''}

	</div>
}
export default DayDetail;
