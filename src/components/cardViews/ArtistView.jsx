// ArtistView.jsx


import m from 'mithril'
//import _ from 'lodash'


import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';

import {remoteData} from '../../store/data';



const ArtistView = (auth) => { return {
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