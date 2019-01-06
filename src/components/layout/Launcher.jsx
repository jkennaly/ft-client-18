// Launcher.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const Launcher = (vnode) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Venues.loadList()
		remoteData.Days.loadList()
		remoteData.Artists.loadList()
		remoteData.Lineups.loadList()
		remoteData.Messages.loadList()
		remoteData.Sets.loadList()
		remoteData.Images.loadList()
		auth.getFtUserId()
			.catch(err => m.route.set('/auth'))
	},
	view: () => 
	<div class="launcher-container">
		<div class="stage-banner-container">
			<LauncherBanner 
				action={() => auth.logout()}
				title="FestivalTime Launcher" 
			/>
		</div>
		<div>
			<WidgetContainer>
				<FixedCardWidget header="Current Festival Dates">
				{
					remoteData.Dates.current()
						.map(data => <DateCard 
							eventId={data.id}
						/>)
				}
				</FixedCardWidget>
				<FixedCardWidget header="Upcoming Festival Dates">
				{
					remoteData.Dates.soon()
						.map(data => <DateCard 
							eventId={data.id}
						/>)
				}
				</FixedCardWidget>
				<FixedCardWidget header="Upcoming Festivals">
				{
					remoteData.Festivals.future()
						.map(data => <FestivalCard 
							eventId={data.id}
						/>)
				}
				</FixedCardWidget>
				<FixedCardWidget header="Artist Discovery">
				{
					//three from next event
					//one ft chosen
					//one from fav event (future if possible, past if not)
					//balance (up to 5 total) from highest uncommented priority
					_.take(remoteData.Artists.virgins(), 5)
						.map(data => <ArtistCard 
							data={data}
						/>)
				}
				</FixedCardWidget>
			</WidgetContainer>
		</div>
	</div>
}}
export default Launcher;
