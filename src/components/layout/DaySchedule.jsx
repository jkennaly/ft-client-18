// DaySchedule.jsx

import m from 'mithril'
import _ from 'lodash'

import DaySelectBar from '../detailViewsPregame/fields/event/DaySelectBar.jsx'
import ScheduleSet from '../fields/ScheduleSet.jsx'
import ScheduleLadder from './ScheduleLadder.jsx'
import {dayChange} from '../../store/action/event'

const startOffset = sets => {
	const earliest = _.min(sets.map(x => x.start))
	const so = Math.ceil(earliest / 60) <= 2 ? 0 : (Math.ceil(earliest / 60) - 2) * 60
	//console.dir('startOffset', so, earliest, sets.map(x => x.start))
	return so
}
const endOffset = sets => {
	const latest = _.max(sets.map(x => x.end))
	const eo = Math.ceil(latest / 60) * 60 + 60 - startOffset(sets)
	//console.dir('startOffset', eo)
	return eo
}

const DaySchedule = (vnode) => {
	//how many minutes at the beginning can be left off
	//how long to make the schedule, starting from start offset
	return {
		oncreate: ({attrs, dom}) => {
			dom.querySelector('.ft-schedule-header').style.width = `calc(${attrs.stages.length * 300}px + 12em)`
		},
		onupdate: ({attrs, dom}) => {
			dom.querySelector('.ft-schedule-header').style.width = `calc(${attrs.stages.length * 300}px + 12em)`
		},
	view: ({attrs}) =>
		<div class="ft-schedule-container">
		{!attrs.hideDayBar ? <DaySelectBar dateId={attrs.dateId} dayChange={dayChange} currentId={attrs.dayId} /> : ''}

		<div class="ft-schedule">
		{
			console.log(`DaySchedule set length`, attrs.sets.length, attrs.dateId, attrs.stages)
		}	<div class="ft-schedule-header">
				{attrs.stages.map(stage => <h2 class="ft-schedule-header-field">{stage.name}</h2>)}
			</div>

			{attrs.dayId && attrs.sets.length ? <ScheduleLadder 
				stageIds={attrs.stages.map(x => x.id)}
				startOffset={startOffset(attrs.sets)}
				endOffset={endOffset(attrs.sets)}
			>
				{/*sets[0] && sets[0].day ? <ScheduleNowBar attrs.dayId={sets[0].day} />: ''*/}
				{attrs.sets
					.filter(data => data.day === attrs.dayId)
					//.filter(x => console.log('Schedule Ladder ', attrs.dayId, attrs.dayId, x) || true)
					.filter(data => data.end)
					//.filter(data => data.stage === 159)
					.map(data => <ScheduleSet 
						set={data}
						startOffset={startOffset(attrs.sets)}
						top={true}
						stage={data.stage}
						clickFunction={() => {
							//console.log('Schedule Ladder Set click')
							//console.dir(data)
							m.route.set(`/artists/pregame/${data.band}`)
						}}
					/>)
				}
			</ScheduleLadder> : ''}
		</div>
		</div>
}}

export default DaySchedule;