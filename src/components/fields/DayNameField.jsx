// DayNameField.jsx
//attrs: dayId

const m = require("mithril");
//const _ = require('lodash');

import {remoteData} from '../../store/data';

const getDayName = id => {
	const day = remoteData.Days.get(id)
	if(!day) return ''
	return day.name
}

const DayNameField = {
	oninit: remoteData.Days.loadList,
	view: ({ attrs }) =>
		<div class="ft-name-field">
			{(getDayName(attrs.dayId))}
			
		
		
		</div >
};

export default DayNameField;