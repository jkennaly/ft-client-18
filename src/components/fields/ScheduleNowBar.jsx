// ScheduleNowBar.jsx

import m from 'mithril'
import {remoteData} from '../../store/data'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

const setHeight = ({attrs, dom}) => dom.style.top = moment().diff(remoteData.Days.getStartMoment(attrs.dayId), 'minutes') + 'px'

const ScheduleNowBar = {
	oncreate: setHeight,
	onupdate: setHeight,
	view: ({ attrs }) => <hr class="gt-schedule-now-bar" />
};

export default ScheduleNowBar;