// FestivalDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import {remoteData} from '../../store/data';

const FestivalDetail = (auth) => { return {
	oninit: () => {
		remoteData.Festivals.loadList()
		remoteData.Series.loadList()
		remoteData.Dates.loadList()
	},
	view: () => <div>
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Festivals.getEventName(parseInt(m.route.param('id'), 10))} 
			/>
		<SeriesCard data={_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getSuperId,
					remoteData.Series.get
					)('id')
				} eventId={_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getSuperId
					)('id')
				}/>
		<CardContainer>
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getSubIds,
					remoteData.Dates.getMany,
					)('id')
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}
export default FestivalDetail;
