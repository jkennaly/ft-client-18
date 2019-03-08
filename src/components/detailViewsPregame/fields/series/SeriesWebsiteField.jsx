// SeriesWebsiteField.jsx

import m from 'mithril'

import {remoteData} from '../../../../store/data'

const getSeriesId = ({id, festivalId}) => {
	if(id) return id
	const upOne = remoteData.Festivals.getSeriesId(festivalId)
	console.log(`SeriesWebsiteField festivalId: ${festivalId} and seriesId:${upOne}`)
	if(festivalId) return upOne
	return 0
}


const SeriesWebsiteField = {
	view: ({ attrs }) =>
		<div class="ft-name-field">Website: {
			getSeriesId(attrs) ? 
				<a href={remoteData.Series.get(getSeriesId(attrs)).website}>
					{remoteData.Series.get(getSeriesId(attrs)).website}
				</a>
			: ''}
		</div >
};

export default SeriesWebsiteField;