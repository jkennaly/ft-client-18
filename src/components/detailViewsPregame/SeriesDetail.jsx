// SeriesDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';

import {remoteData} from '../../store/data';

import SeriesDescriptionField from './fields/series/SeriesDescriptionField.jsx'
import SeriesWebsiteField from './fields/series/SeriesWebsiteField.jsx'

const SeriesDetail = (auth) => { return {
	oninit: () => {
		remoteData.Festivals.loadList()
		remoteData.Series.loadList()
	},
	view: () => <div>
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Series.getEventName(parseInt(m.route.param('id'), 10))} 
		/>
		{remoteData.Series.get(parseInt(m.route.param('id'), 10)) ? <SeriesDescriptionField id={parseInt(m.route.param('id'), 10)} /> : ''}
		{remoteData.Series.get(parseInt(m.route.param('id'), 10)) ? <SeriesWebsiteField id={parseInt(m.route.param('id'), 10)} /> : ''}
		<CardContainer>
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Series.getSubIds,
					remoteData.Festivals.getMany,
					)('id')
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
