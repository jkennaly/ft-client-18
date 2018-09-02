// DateVenueField.jsx

const m = require("mithril");

import {remoteData} from '../../../../store/data'

const DateVenueField = {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Venues.loadList()
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			{remoteData.Venues.getPlaceName(remoteData.Dates.get(attrs.id) ? remoteData.Dates.get(attrs.id).venue : 0)}
		</div >
};

export default DateVenueField;