// FestivalView.jsx


import m from 'mithril'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';

import {remoteData} from '../../store/data';



const nameReduce = targetId => (n, s) => n.length || s.id !== targetId ? n : s.name

const FestivalView = (auth) => { return {
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
				title="FestivalTime Years" 
			/>
		<CardContainer>
		<FestivalCard eventId={'new'}/>
			
			{
				remoteData.Festivals.list
					.map(data => <FestivalCard  
						seriesId={data.series}
						festivalId={data.id}
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}
export default FestivalView;