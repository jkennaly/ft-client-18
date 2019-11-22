// ScheduleThemer.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

const dragula = require("dragula");

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'


import DaySchedule from './DaySchedule.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx'
import ActivityCard from '../../components/cards/ActivityCard.jsx'
import FixedCardWidget from '../../components/widgets/FixedCard.jsx'
import EventSelector from '../detailViewsPregame/fields/event/EventSelector.jsx'


import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'
import {seriesChange, festivalChange, dateChange, dayChange} from '../../store/action/event'



const ScheduleThemer = () => {
	let seriesId
	let festivalId
	let dateId
	let dayId
	var drake = {}

	return {
		oninit: ({attrs}) => {
			if (attrs.titleSet) attrs.titleSet(`Schedule Themer`)
			seriesId = attrs.seriesId ? parseInt(attrs.seriesId, 10) : 0
			festivalId = attrs.festivalId ? parseInt(attrs.festivalId, 10) : 0
			dateId = attrs.dateId ? parseInt(attrs.dateId, 10) : 0
			dayId = attrs.dayId ? parseInt(attrs.dayId, 10) : 0












			if(festivalId) remoteData.Festivals.subjectDetails({subjectType: remoteData.Festivals.subjectType, subject: festivalId})

				.catch(err => {
					console.error('FestivalDetail Message load error')
					console.error(err)
				})
		},
		oncreate: vnode => {
			drake = dragula([])
		},
		view: ({attrs}) => 
		<div class="main-stage">
		

				<EventSelector 
					seriesId={seriesId}
					festivalId={festivalId}
					dateId={dateId}
					dayId={dayId}
					seriesChange={seriesChange}
					festivalChange={festivalChange(seriesId)}
					dateChange={dateChange(seriesId, festivalId)}
					dayChange={dayChange(seriesId, festivalId, dateId)}
					scheduled={true}
				/>

				<div class="main-stage-content-scroll">
				<WidgetContainer>
					<FixedCardWidget header="Score Types">
					</FixedCardWidget>
					<FixedCardWidget header="Applied Scores">
					</FixedCardWidget>
					<FixedCardWidget header="Palettes">
					</FixedCardWidget>
				</WidgetContainer>
			</div>
		<DaySchedule
				dateId={dateId}
				dayId={console.log('ScheduleThemer dayId', dayId) || dayId}
				sets={remoteData.Sets.getMany(remoteData.Days.getSubSetIds(dayId)).filter(x => true || console.log('sets', x) || true)}
				stages={remoteData.Places.getFiltered(s => s.festival === festivalId)}
				hideDayBar={true}
		/>

		</div>

}}
export default ScheduleThemer;
