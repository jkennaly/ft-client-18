// ArtistDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import {remoteData} from '../../store/data';

const ArtistDetail = (auth) => { return {
	oninit: () => {
		remoteData.Artists.loadList()
	},
	view: () => <div>
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Artists.getName(parseInt(m.route.param('id'), 10))} 
			/>

	</div>
}}
export default ArtistDetail;
