// src/components/fields/ScheduleNowBar.jsx

import m from 'mithril'
import {remoteData} from '../../store/data'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

const setHeight = ({attrs, dom}) => {
	try {
		const now = moment()
		const dayStart = remoteData.Days.getStartMoment(attrs.dayId)
		//console.log('setHeight now', now, dayStart)
		dom.style.top = now.diff(dayStart, 'minutes') + 'px'

	} catch {
		dom.style.top = '0px'
	}
} 

//calculate the number 
const ScheduleNowBar = {
	oncreate: setHeight,
	onupdate: setHeight,
	view: ({ attrs }) => <hr class="gt-schedule-now-bar" />
};

export default ScheduleNowBar;