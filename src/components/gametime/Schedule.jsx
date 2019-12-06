 // src/components/gametime/Schedule.jsx

//a full screen component that displays the days schedule

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'
import {remoteData} from '../../store/data'

import ScheduleSet from '../fields/ScheduleSet.jsx'
import ScheduleLabel from '../fields/ScheduleLabel.jsx'
import ScheduleNowBar from '../fields/ScheduleNowBar.jsx'
import ScheduleLadder from '../layout/ScheduleLadder.jsx'


const sets = remoteData.Sets
const places = remoteData.Places

const allSets = dayId => sets.getFiltered({day: dayId})
const stages = allSets => places.getMany(allSets.map(x => x.stage))
	.sort((a, b) => a.priority - b.priority)

const Schedule = ({attrs}) => { 
	return {
		oninit: ({attrs}) => {
			//console.log('Gametime oninit')
		},
		oncreate: ({attrs, dom}) => {
			dom.querySelector('.ft-schedule-header').style.width = `calc(${stages(allSets(_.get(attrs.subjectObject, 'subject', 0))).length * 300}px + 12em)`
		},
		onupdate: ({attrs, dom}) => {
			dom.querySelector('.ft-schedule-header').style.width = `calc(${stages(allSets(_.get(attrs.subjectObject, 'subject', 0))).length * 300}px + 12em)`
		},
		view: ({attrs}) => <div class="ft-schedule">
			<div class="ft-schedule-header">
				{stages(allSets(_.get(attrs.subjectObject, 'subject', 0))).map(stage => <h2 class="ft-schedule-header-field">{stage.name}</h2>)}
			</div>

			<ScheduleLadder stageIds={stages(allSets(_.get(attrs.subjectObject, 'subject', 0))).map(x => x.id)}>
				{ [<ScheduleNowBar display={true} dayId={attrs.subjectObject.subject} />,
				...allSets(attrs.subjectObject.subject)
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
							m.route.set(`/gametime/${SET}/${data.id}`)
						}}
					/>)
				]}
			</ScheduleLadder>
		</div>
}};

export default Schedule;