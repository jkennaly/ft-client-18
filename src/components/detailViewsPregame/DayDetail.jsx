// DayDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import {remoteData} from '../../store/data';

const DayDetail = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Sets.loadList()
		remoteData.Artists.loadList()
		remoteData.Lineups.loadList()
		remoteData.Places.loadList()
		remoteData.Messages.loadList()
		remoteData.ArtistPriorities.loadList()
	},
	view: () => <div>
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Days.getEventName(parseInt(m.route.param('id'), 10))} 
			/>
		
		<DateCard eventId={_.flow(
					m.route.param, parseInt,
					remoteData.Days.getSuperId
					)('id')
				}/>

		<CardContainer>
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Days.getSubSetIds,
					remoteData.Sets.getMany)('id')
					.sort((a, b) => {
						const dayId = _.flow(m.route.param, parseInt)('id')
						const festivalId = remoteData.Days.getFestivalId(dayId)
						const aPriId = remoteData.Lineups.getPriFromArtistFest(a.band, festivalId)
						const bPriId = remoteData.Lineups.getPriFromArtistFest(b.band, festivalId)
						if(aPriId === bPriId) return remoteData.Sets.getEventName(a.id).localeCompare(remoteData.Sets.getEventName(b.id))
						const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
						const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
						return aPriLevel - bPriLevel
					})
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
export default DayDetail;
