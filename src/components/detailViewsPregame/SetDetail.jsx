// SetDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';

import {remoteData} from '../../store/data';

const SetDetail = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Sets.loadList()
		remoteData.Artists.loadList()
		remoteData.Lineups.loadList()
		remoteData.Messages.loadList()
		remoteData.ArtistPriorities.loadList()
	},
	view: () => <div class="main-stage">
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Sets.getEventName(parseInt(m.route.param('id'), 10))} 
			/>
		<span>

		</span>
	</div>
}}
export default SetDetail;
