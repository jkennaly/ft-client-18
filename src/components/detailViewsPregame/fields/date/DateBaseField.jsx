// DateBaseField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const DateBaseField = {
	oninit: () => {
		remoteData.Dates.loadList()
	},
	view: ({ attrs }) =>
		<div class="ft-date-field">
			{remoteData.Dates.get(attrs.id) ? (new Date(remoteData.Dates.get(attrs.id).basedate)).toUTCString() : ''}
		</div >
};

export default DateBaseField;