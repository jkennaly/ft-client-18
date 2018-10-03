// ArtistDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistReviewCard from '../../components/cards/ArtistReviewCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';

import {remoteData} from '../../store/data';

const ArtistDetail = (vnode) => { 
	var artistId = 0
	var messages = []
	return {
		oninit: () => {
			remoteData.Artists.loadList()
			remoteData.Messages.loadList()
			remoteData.Lineups.loadList()
			remoteData.Festivals.loadList()
			remoteData.Series.loadList()
			artistId = parseInt(m.route.param('id'), 10)
			messages = remoteData.Messages.forArtist(artistId)
		},
		view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Artists.getName(artistId)} 
			
			/>
			<WidgetContainer>
				<FixedCardWidget header="Festival Lineups">
					{
						remoteData.Lineups.festivalsForArtist(artistId)
							.map(f => <FestivalCard eventId={f} />)
					}
				</FixedCardWidget>
			
			</WidgetContainer>
				
				{
					//find each message about this artist and order by user
					_.map(remoteData.Messages.forArtistReviewCard(artistId),
						me => <ArtistReviewCard messageArray={me} />)
				}

		</div>
}}
export default ArtistDetail;
