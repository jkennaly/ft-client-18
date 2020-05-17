// src/components/layout/ScheduleThemer.jsx

const dragula = require("dragula");

import m from 'mithril'
import _ from 'lodash'

import DaySchedule from './DaySchedule.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx'
import ActivityCard from '../../components/cards/ActivityCard.jsx'
import FixedCardWidget from '../../components/widgets/FixedCard.jsx'
import EventSelector from '../detailViewsPregame/fields/event/EventSelector.jsx'


import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'
import {seriesChange, festivalChange, dateChange, dayChange} from '../../store/action/event'

const {Sets: sets, Places: places, Days: days, Dates: dates, Festivals: festivals} = remoteData

var drake = {}

const ScheduleThemer = {
	name: 'ScheduleThemer',
	preload: (rParams) => {
			//console.log('dayDetails preload')
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const seriesId = parseInt(rParams.seriesId, 10)
			const festivalId = parseInt(rParams.festivalId, 10)
			const dateId = parseInt(rParams.dateId, 10)
			//messages.forArtist(dateId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			return Promise.all([
					!seriesId ? series.remoteCheck(true) : true,
					seriesId && !festivalId ? Promise.all([
						series.subjectDetails({subject: seriesId, subjectType: SERIES}),
						festivals.remoteCheck(true)
						]) : true,
					festivalId && !dateId ? Promise.all([
						festivals.subjectDetails({subject: festivalId, subjectType: FESTIVAL}),
						dates.remoteCheck(true)
						]) : true,
					dateId ? dates.subjectDetails({subject: dateId, subjectType: DATE}) : true
			])
		},
	oninit: ({attrs}) => {
		if (attrs.titleSet) attrs.titleSet(`Schedule Themer`)
	},
	view: ({attrs}) => {

		const mapping = {
			seriesId: attrs.seriesId ? parseInt(attrs.seriesId, 10) : 0,
			festivalId: attrs.festivalId ? parseInt(attrs.festivalId, 10) : 0,
			dateId: attrs.dateId ? parseInt(attrs.dateId, 10) : 0,
			dayId: attrs.dayId ? parseInt(attrs.dayId, 10) : 0,
			sets: sets.getMany(days.getSubSetIds(attrs.dayId ? parseInt(attrs.dayId, 10) : 0)),
			stages: places.getFiltered(s => s.festival === attrs.festivalId ? parseInt(attrs.festivalId, 10) : 0)
		}
			//console.log(`ScheduleThemer mapping`, mapping)
		return m({
			oncreate: vnode => {
				drake = dragula([].slice.call(vnode.dom.querySelectorAll(`.c44-widget-dragula`)))
			},
			view: ({attrs}) => <div class="main-stage">
			{
				//console.log(`ScheduleThemer attrs`, attrs)
			}
				<EventSelector 
					seriesId={attrs.seriesId}
					festivalId={attrs.festivalId}
					dateId={attrs.dateId}
					dayId={attrs.dayId}
					seriesChange={seriesChange}
					festivalChange={festivalChange(attrs.seriesId)}
					dateChange={dateChange(attrs.seriesId, attrs.festivalId)}
					dayChange={dayChange(attrs.seriesId, attrs.festivalId, attrs.dateId)}
				/>

				<div class="main-stage-content-scroll">
				<WidgetContainer>
					<FixedCardWidget header="Score Types" containerClasses={'c44-widget-dragula'}>
					</FixedCardWidget>
					<FixedCardWidget header="Applied Scores" containerClasses={'c44-widget-dragula'}>
					</FixedCardWidget>
					<FixedCardWidget header="Palettes" containerClasses={'c44-widget-dragula'}>
					</FixedCardWidget>
				</WidgetContainer>
				</div>
				<DaySchedule
						dateId={attrs.dateId}
						dayId={attrs.dayId}
						sets={attrs.sets}
						stages={attrs.stages}
						hideDayBar={true}
				/>

			</div>
		}, mapping)
	}
}
export default ScheduleThemer;
