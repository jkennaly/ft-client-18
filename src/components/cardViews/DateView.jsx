// DateView.jsx


import m from 'mithril'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import {remoteData} from '../../store/data';



const DateView = (auth) => { return {
	oninit: () => {
		remoteData.Messages.loadList()
		remoteData.MessagesMonitors.loadList()
		remoteData.Images.loadList()
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Sets.loadList()
		remoteData.Venues.loadList()
		remoteData.Places.loadList()
		remoteData.Lineups.loadList()
      	remoteData.ArtistPriorities.loadList()
      	remoteData.StagePriorities.loadList()
      	remoteData.ArtistAliases.loadList()
		remoteData.Artists.loadList()
		remoteData.Users.loadList()
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title="FestivalTime Dates" 
			/>
		<CardContainer>
			{
				remoteData.Dates.list
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}

export default DateView;
