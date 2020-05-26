// src/components/fields/SeriesNameField.jsx
//attrs: seriesId

import m from 'mithril'
////import _ from 'lodash'

import {remoteData} from '../../store/data';

const getSeriesName = id => {
	const series = remoteData.Series.get(id)
	if(!series) return ''
	return series.name
}

const SeriesNameField = {
	view: ({ attrs }) =>
		<span class="c44-name-field">
			{(getSeriesName(attrs.seriesId))}
			
		
		
		</span >
};

export default SeriesNameField;