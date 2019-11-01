// DateVenueField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const DateVenueField = {
	oninit: () => {
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			{remoteData.Venues.getPlaceName(remoteData.Dates.get(attrs.id) ? remoteData.Dates.get(attrs.id).venue : 0)}
		</div >
};

export default DateVenueField;