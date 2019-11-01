// EventSelector.jsx
import m from 'mithril'

import StageSelector from '../place/StageSelector.jsx'
import DaySelector from '../day/DaySelector.jsx'
import DateSelector from '../date/DateSelector.jsx'
import FestivalSelector from '../festival/FestivalSelector.jsx'
import SeriesSelector from '../series/SeriesSelector.jsx'


import {remoteData} from '../../../../store/data'


const EventSelector = vnode => { 

	return {
		oninit: () => {
		},
		view: ({attrs}) => <div class="ft-event-selector" id="ft-event-selector">
			{!attrs.seriesChange ? '' : <SeriesSelector 
				seriesId={attrs.seriesId}
				seriesChange={attrs.seriesChange}
			/>}
			{!attrs.festivalChange ? '' : <FestivalSelector 
				seriesId={attrs.seriesId}
				festivalId={attrs.festivalId}
				festivalChange={attrs.festivalChange}
			/>}
			{!attrs.dateChange ? '' : <DateSelector 
				festivalId={attrs.festivalId}
				dateId={attrs.dateId}
				dateChange={attrs.dateChange}
			/>}
			{!attrs.dayChange ? '' : <DaySelector 
				dateId={attrs.dateId}
				dayId={attrs.dayId}
				dayChange={attrs.dayChange}
			/>}
			{!attrs.stageChange ? '' : <StageSelector 
				festivalId={attrs.festivalId}
				stageChange={attrs.stageChange}
			/>}
	    </div>
}};

export default EventSelector;