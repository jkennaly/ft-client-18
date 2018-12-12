// SeriesWebsiteField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const SeriesWebsiteField = {
	view: ({ attrs }) =>
		<div class="ft-name-field">Website:
			<a href={remoteData.Series.get(attrs.id).website}>{remoteData.Series.get(attrs.id).website}</a>
		</div >
};

export default SeriesWebsiteField;