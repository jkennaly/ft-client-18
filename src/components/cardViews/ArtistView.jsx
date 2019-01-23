// ArtistView.jsx


import m from 'mithril'
//import _ from 'lodash'


import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';

import {remoteData} from '../../store/data';



const ArtistView = (auth) => { return {
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
				title="FestivalTime Artists" 
			/>
		<CardContainer>
			{
				_.take(remoteData.Artists.list
				, 25)
				.map(data => <ArtistCard data={data}/>)
			}
		</CardContainer>
	</div>
}}
export default ArtistView;