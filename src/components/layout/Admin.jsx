// Admin.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'

import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const Admin = (vnode) => { return {
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
	view: () => <div class="main-stage">
			<LauncherBanner 
				action={() => auth.logout()}
				title="FestivalTime Admin" 
			/>
		<div class="main-stage-content">
			<WidgetContainer>
				<FixedCardWidget header="Create Festivals">
					<SeriesCard eventId="new"/>
					<FestivalCard eventId="new"/>
					<DateCard eventId="new"/>
					<NavCard fieldValue="New Venue" action={() => m.route.set("/venues/pregame/new")}/>
					<NavCard fieldValue="Fix Artist Names" action={() => m.route.set("/artists/pregame/fix")}/>
					<NavCard fieldValue="Assign Artists to Festival" action={() => m.route.set("/fests/pregame/assignLineup")}/>
					<NavCard fieldValue="Assign Stages to Festival" action={() => m.route.set("/fests/pregame/assignStages")}/>
					<NavCard fieldValue="Assign Artists to Days" action={() => m.route.set("/sets/pregame/assignDays")}/>
					<NavCard fieldValue="Assign Artists to Stages" action={() => m.route.set("/sets/pregame/assignStages")}/>
					<NavCard fieldValue="Enter Set Times" action={() => m.route.set("/sets/pregame/assignTimes")}/>
				</FixedCardWidget>

			<FixedCardWidget header="Empty Series">
			{
				remoteData.Series.noFutureDates()
					.map(series => <SeriesCard 
						data={series} eventId={series.id}
					/>)
			}
			</FixedCardWidget>
			</WidgetContainer>
		</div>
	</div>
}}
export default Admin;
