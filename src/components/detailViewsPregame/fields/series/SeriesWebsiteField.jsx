// SeriesWebsiteField.jsx

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const getSeriesId = ({id, festivalId}) => {
	if(id) return id
	const upOne = remoteData.Festivals.getSeriesId(festivalId)
	//console.log(`SeriesWebsiteField festivalId: ${festivalId} and seriesId:${upOne}`)
	if(festivalId) return upOne
	return 0
}

const website = attrs => _.get(remoteData.Series.get(getSeriesId(attrs)), 'website')
const SeriesWebsiteField = {
	view: ({ attrs }) =>
		<div class="ft-name-field">Website: {
			website(attrs) ? 
				<a href={website(attrs)} target="_blank">
					{website(attrs)}

				</a>
			: ''}
		</div >
};

export default SeriesWebsiteField;