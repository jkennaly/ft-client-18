// SeriesWebsiteField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const SeriesWebsiteField = {
	view: ({ attrs }) =>
		<div class="c44-name-field">Description:
			<p>{remoteData.Series.get(attrs.id).description}</p>
		</div >
};

export default SeriesWebsiteField;