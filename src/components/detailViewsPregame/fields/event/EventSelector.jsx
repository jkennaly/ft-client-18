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
		view: ({attrs}) => <div class="c44-event-selector" id="c44-event-selector">
			{!attrs.seriesChange ? '' : <SeriesSelector 
				seriesId={attrs.seriesId}
				seriesChange={attrs.seriesChange}
				scheduled={attrs.scheduled}
			/>}
			{!attrs.festivalChange ? '' : <FestivalSelector 
				seriesId={attrs.seriesId}
				festivalId={attrs.festivalId}
				festivalChange={attrs.festivalChange}
				scheduled={attrs.scheduled}
			/>}
			{!attrs.dateChange ? '' : <DateSelector 
				festivalId={attrs.festivalId}
				dateId={attrs.dateId}
				dateChange={attrs.dateChange}
				scheduled={attrs.scheduled}
			/>}
			{!attrs.dayChange ? '' : <DaySelector 
				dateId={attrs.dateId}
				dayId={attrs.dayId}
				dayChange={attrs.dayChange}
				scheduled={attrs.scheduled}
			/>}
			{!attrs.stageChange ? '' : <StageSelector 
				festivalId={attrs.festivalId}
				stageChange={attrs.stageChange}
				stageId={attrs.stageId}
				scheduled={attrs.scheduled}
			/>}
	    </div>
}};

export default EventSelector;