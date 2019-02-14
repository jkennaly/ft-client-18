// SeriesDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ToggleControl from '../../components/ui/ToggleControl.jsx';

import {remoteData} from '../../store/data';


import SeriesDescriptionField from './fields/series/SeriesDescriptionField.jsx'
import SeriesWebsiteField from './fields/series/SeriesWebsiteField.jsx'

const SeriesDetail = (auth) => { 
	let seriesId = 0
	let series
	return {
	oninit: () => {
		seriesId = parseInt(m.route.param('id'), 10)
		series = remoteData.Series.get(seriesId)
		//console.log('SeriesDetail oninit')
		//console.log(seriesId)
		//console.log(series)
		remoteData.Festivals.loadList()
		if(!series) {
			remoteData.Series.loadList()
				.then(() => series ? '' : series = remoteData.Series.get(seriesId))
		} 
	},
	onupdate: () => series = remoteData.Series.get(seriesId),
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Series.getEventName(seriesId)} 
		/>
		{series ? <ToggleControl
			offLabel={'Active'}
			onLabel={'On hiatus'}
			getter={() => series.hiatus}
			setter={newState => {
				remoteData.Series.updateInstance(seriesId, {hiatus: newState})
					//.then(m.redraw)
				//m.redraw()
			}}
		/> : ''}
		{series ? <SeriesDescriptionField id={seriesId} /> : ''}
		{series ? <SeriesWebsiteField id={seriesId} /> : ''}
		<CardContainer>
			<FestivalCard  seriesId={seriesId} eventId={'new'}/>
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Series.getSubIds,
					remoteData.Festivals.getMany,
					)('id')
					.sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10))
					.map(data => <FestivalCard  
						seriesId={data.series}
						festivalId={data.id}
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}
export default SeriesDetail;
