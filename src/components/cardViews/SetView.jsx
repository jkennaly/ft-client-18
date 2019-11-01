// SetView.jsx


import m from 'mithril'
//import _ from 'lodash'


import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import {remoteData} from '../../store/data';

const SetView = (auth) => { return {
	oninit: () => {
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title="FestivalTime Sets" 
			/>
		<CardContainer>
			{
				_.take(remoteData.Sets.list
				, 25)
				.map(data => <SetCard superId={data.day}
					nameFrag={''}
					artistName={remoteData.Artists.getName(data.band)}
					averageRating={remoteData.Messages.setAverageRating(data.id)}
					stageId={data.stage}
					dayId={data.day}
					eventId={data.id}
					dateId={remoteData.Days.getDateId(data.day)}
					festivalId={remoteData.Days.getFestivalId(data.day)}
					seriesId={remoteData.Days.getSeriesId(data.day)}
					artistPriorityName={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(data.band, remoteData.Days.getFestivalId(data.day)))}
					/>)
			}
		</CardContainer>
		</div>
}}
export default SetView;