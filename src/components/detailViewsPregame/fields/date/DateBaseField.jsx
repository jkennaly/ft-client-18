// DateBaseField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const DateBaseField = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="c44-date-field">
			{remoteData.Dates.get(attrs.id) ? (new Date(remoteData.Dates.get(attrs.id).basedate)).toUTCString() : ''}
		</div >
};

export default DateBaseField;