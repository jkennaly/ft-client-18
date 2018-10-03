// DateDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import DateVenueField from './fields/date/DateVenueField.jsx'
import DateBaseField from './fields/date/DateBaseField.jsx'
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import DayCard from '../../components/cards/DayCard.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';

import {remoteData} from '../../store/data';

const DateDetail = (auth) => { return {
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
		remoteData.Venues.loadList()
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Dates.getEventName(parseInt(m.route.param('id'), 10))} 
		
			/>
		{remoteData.Dates.get(parseInt(m.route.param('id'), 10)) ? <DateVenueField id={parseInt(m.route.param('id'), 10)} /> : ''}
		{remoteData.Dates.get(parseInt(m.route.param('id'), 10)) ? <DateBaseField id={parseInt(m.route.param('id'), 10)} /> : ''}
		<FestivalCard seriesId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSeriesId,
				)('id')
			}
			festivalId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSuperId
				)('id')
			}
			eventId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSuperId
				)('id')
			}
		/>
			<WidgetContainer>
		<FixedCardWidget header="Festival Days">
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Dates.getSubIds,
					remoteData.Days.getMany)('id')
					.sort((a, b) => a.daysOffset - b.daysOffset)
					.map(data => <DayCard 
						eventId={data.id}
					/>)
			}
		</FixedCardWidget>
		<FixedCardWidget header="Scheduled Sets">
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Dates.getSubSetIds,
					remoteData.Sets.getMany)('id')
					.sort((a, b) => {
						const dayId = _.flow(m.route.param, parseInt)('id')
						const festivalId = remoteData.Dates.getFestivalId(dayId)
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
		</FixedCardWidget>
			</WidgetContainer>
	</div>
}}
export default DateDetail;
