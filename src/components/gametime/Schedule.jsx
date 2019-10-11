 // Schedule.jsx

//a full screen component that displays the days schedule

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'

import ScheduleSet from '../fields/ScheduleSet.jsx'
import ScheduleLabel from '../fields/ScheduleLabel.jsx'
import ScheduleNowBar from '../fields/ScheduleNowBar.jsx'
import ScheduleLadder from '../layout/ScheduleLadder.jsx'

const Schedule = ({attrs}) => { 
	var sets, stages
	return {
		oninit: ({attrs}) => {
			//console.log('Gametime oninit')
			sets = subjectData.sets(attrs.subjectObject)
			stages = subjectData.getManySingleType(
				_.uniq(sets.map(s => s.stage))
					.map(s => {return {subject: s, subjectType: 4}}))
				.sort((a, b) => a.priority - b.priority)
		},
		oncreate: ({attrs, dom}) => {
			dom.querySelector('.ft-schedule-header').style.width = `calc(${stages.length * 300}px + 12em)`
		},
		view: ({attrs}) => <div class="ft-schedule">
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
							m.route.set(`/gametime/${subjectData.SET}/${data.id}`)
						}}
					/>)
				}
			</ScheduleLadder>
		</div>
}};

export default Schedule;