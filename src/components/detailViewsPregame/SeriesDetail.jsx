// SeriesDetail.jsx


import m from 'mithril'
const _ = require("lodash");

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';

import {remoteData} from '../../store/data';
import {getAppContext} from '../../store/ui';

import SeriesDescriptionField from './fields/series/SeriesDescriptionField.jsx'
import SeriesWebsiteField from './fields/series/SeriesWebsiteField.jsx'

const SeriesDetail = (auth) => { return {
	oninit: () => {
		remoteData.Festivals.loadList()
		remoteData.Series.loadList()
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Series.getEventName(parseInt(m.route.param('id'), 10))} 
		/>
		{remoteData.Series.get(parseInt(m.route.param('id'), 10)) ? <SeriesDescriptionField id={parseInt(m.route.param('id'), 10)} /> : ''}
		{remoteData.Series.get(parseInt(m.route.param('id'), 10)) ? <SeriesWebsiteField id={parseInt(m.route.param('id'), 10)} /> : ''}
		<CardContainer>
			{getAppContext() === 'pregame' ? <FestivalCard  seriesId={parseInt(m.route.param('id'), 10)} eventId={'new'}/> : ''}
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
