// ScheduleLadder.jsx

import m from 'mithril'
import  ScheduleLabel from '../fields/ScheduleLabel.jsx';

const labelDefault = [
	'10:00', '11:00 AM', 
	'12:00', '1:00 PM', '2:00', '3:00 PM', '4:00', '5:00 PM', '6:00', '7:00 PM', '8:00', '9:00 PM', '10:00', '11:00 PM',
	'12:00', '1:00 AM', '2:00', '3:00 AM', '4:00', '5:00 AM', '6:00', '7:00 AM', '8:00', '9:00 AM'
]
const ScheduleLadder = (vnode) => {
	return {
		oncreate: ({attrs, dom}) => {
			dom.style.width = attrs.stageIds ? `calc(${attrs.stageIds.length * 300}px + 12em)` : `calc(300px + 12em)`
		},
		view: ({attrs, children}) => {
		    return <div class="schedule-ladder">
		      	<div class="schedule-labels">
		      		{
		      			(attrs.labels ? attrs.labels : labelDefault)
		      				.map(l => <ScheduleLabel label={l} />)
		      		}
		      	</div>
		      	{
		      		//if stageIds is passed, make a setbox for each stageId.
		      		//if not, make one setbox for all sets
		      	}
		      	{ attrs.stageIds ?
		      		attrs.stageIds.map(stageId => <div class="schedule-setbox">
		        	{
		        		children
		        			.filter(x => x.attrs.stage === stageId)

		        	}
		      		</div>)
		      	: <div class="schedule-setbox">
		        	{
		        		children

		        	}
		      		</div> }
		      	
		      	<div class="schedule-labels">
		      		{
		      			(attrs.labels ? attrs.labels : labelDefault)
		      				.map(l => <ScheduleLabel label={l} />)
		      		}
		      	</div>

		     </div>}
}};

export default ScheduleLadder;