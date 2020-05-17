// DateVenueField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const DateVenueField = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="c44-name-field">
			{remoteData.Venues.getPlaceName(remoteData.Dates.get(attrs.id) ? remoteData.Dates.get(attrs.id).venue : 0)}
		</div >
};

export default DateVenueField;