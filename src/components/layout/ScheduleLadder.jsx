// ScheduleLadder.jsx

const m = require("mithril");
import  ScheduleLabel from '../fields/ScheduleLabel.jsx';

const labelDefault = [
	'11:00 AM', 
	'12:00', '1:00 PM', '2:00', '3:00 PM', '4:00', '5:00 PM', '6:00', '7:00 PM', '8:00', '9:00 PM', '10:00', '11:00 PM',
	'12:00', '1:00 AM', '2:00', '3:00 AM', '4:00', '5:00 AM', '6:00', '7:00 AM', '8:00', '9:00 AM', '10:00'
]
const ScheduleLadder = (vnode) => {

	return {
	  view: ({attrs, children}) => {
	    return <div class="schedule-ladder">
	      	<div class="schedule-labels">
	      		{
	      			(attrs.labels ? attrs.labels : labelDefault)
	      				.map(l => <ScheduleLabel label={l} />)
	      		}
	      	</div>
	      	<div class="schedule-setbox">
	        	{children}
	      	</div>

	     </div>}
}};

export default ScheduleLadder;