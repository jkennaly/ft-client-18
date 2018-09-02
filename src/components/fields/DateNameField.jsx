// DateNameField.jsx
//attrs: dateId

const m = require("mithril");
//const _ = require('lodash');

import {remoteData} from '../../store/data';

const getDateName = id => {
	const date = remoteData.Dates.get(id)
	if(!date) return ''
	return date.name
}

const DateNameField = {
	oninit: remoteData.Dates.loadList,
	view: ({ attrs }) =>
		<div class="ft-name-field">
			{(getDateName(attrs.dateId))}
		</div >
};

export default DateNameField;