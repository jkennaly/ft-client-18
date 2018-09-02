// DateDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import DateVenueField from './fields/date/DateVenueField.jsx'
import DateBaseField from './fields/date/DateBaseField.jsx'
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import DayCard from '../../components/cards/DayCard.jsx';

import {remoteData} from '../../store/data';

const DateDetail = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Venues.loadList()
	},
	view: () => <div>
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Dates.getEventName(parseInt(m.route.param('id'), 10))} 
		/>
		{remoteData.Dates.get(parseInt(m.route.param('id'), 10)) ? <DateVenueField id={parseInt(m.route.param('id'), 10)} /> : ''}
		{remoteData.Dates.get(parseInt(m.route.param('id'), 10)) ? <DateBaseField id={parseInt(m.route.param('id'), 10)} /> : ''}
		<FestivalCard seriesId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSeriesId,
				)('id')
			}
			festivalId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSuperId
				)('id')
			}
			eventId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSuperId
				)('id')
			}
		/>
		<CardContainer>
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Dates.getSubIds,
					remoteData.Days.getMany,
					)('id')
					.map(data => <DayCard 
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}
export default DateDetail;
