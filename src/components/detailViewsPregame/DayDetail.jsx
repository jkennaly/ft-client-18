// DayDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

import EventPeerBar from './fields/event/EventPeerBar.jsx'

import ScheduleSet from '../fields/ScheduleSet.jsx'
import ScheduleLabel from '../fields/ScheduleLabel.jsx'
import ScheduleNowBar from '../fields/ScheduleNowBar.jsx'
import ScheduleLadder from '../layout/ScheduleLadder.jsx'

const DayDetail = () => { 
	var sets, stages, event
	return {
		oninit: ({attrs}) => {
			//console.log('Gametime oninit')
			event = {
				subject: parseInt(m.route.param('id'), 10), 
				subjectType: 9
			}
			sets = subjectData.sets(event)
			stages = subjectData.getManySingleType(
				_.uniq(sets.map(s => s.stage))
					.map(s => {return {subject: s, subjectType: 4}}))
				.sort((a, b) => a.priority - b.priority)
		},
		oncreate: ({attrs, dom}) => {
			dom.querySelector('.ft-schedule-header').style.width = `calc(${stages.length * 300}px + 12em)`
		},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Days.getEventName(parseInt(m.route.param('id'), 10))} 
			
			/>
		
		<DateCard eventId={remoteData.Days.getSuperId(parseInt(m.route.param('id'), 10))
					
					
				}/>
		<EventPeerBar event={event} />

		<div class="ft-schedule">
			<div class="ft-schedule-header">
				{stages.map(stage => <h2 class="ft-schedule-header-field">{stage.name}</h2>)}
			</div>

			<ScheduleLadder stageIds={stages.map(x => x.id)}>
				{/*sets[0] && sets[0].day ? <ScheduleNowBar dayId={sets[0].day} />: ''*/}
				{sets
					//.filter(x => console.log('Schedule Ladder ', x) || true)
					.filter(data => data.end)
					//.filter(data => data.stage === 159)
					.map(data => <ScheduleSet 
						set={data}
						top={true}
						stage={data.stage}
						clickFunction={() => {
							//console.log('Schedule Ladder Set click')
							//console.dir(data)
							m.route.set(`/artists/pregame/${data.band}`)
						}}
					/>)
				}
			</ScheduleLadder>
		</div>
		
	</div>
}}
export default DayDetail;
