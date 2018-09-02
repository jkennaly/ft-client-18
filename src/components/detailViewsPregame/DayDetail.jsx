// DayDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import {remoteData} from '../../store/data';

const DayDetail = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
	},
	view: () => <div>
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Days.getEventName(parseInt(m.route.param('id'), 10))} 
			/>
		
		<DateCard eventId={_.flow(
					m.route.param, parseInt,
					remoteData.Days.getSuperId
					)('id')
				}/>
		
	</div>
}}
export default DayDetail;
