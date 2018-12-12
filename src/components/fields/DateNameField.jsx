// DateNameField.jsx
//attrs: dateId

import m from 'mithril'
////import _ from 'lodash'

import {remoteData} from '../../store/data';

const getDateName = id => {
	const date = remoteData.Dates.get(id)
	if(!date) return ''
	return date.name
}

const DateNameField = {
	oninit: remoteData.Dates.loadList,
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getDateName(attrs.dateId))}
		</span >
};

export default DateNameField;