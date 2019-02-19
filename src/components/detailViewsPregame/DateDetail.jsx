// DateDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import IntentToggle from '../ui/canned/IntentToggle.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import DateVenueField from './fields/date/DateVenueField.jsx'
import DateBaseField from './fields/date/DateBaseField.jsx'
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import DayCard from '../../components/cards/DayCard.jsx';
import SetCard from '../../components/cards/SetCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import LineupWidget from '../../components/widgets/canned/LineupWidget.jsx';

import {remoteData} from '../../store/data';

const DateDetail = (auth) => { 
	var sets = []
	var lineup = []
	var festivalId = 0
	var dateId = 0

	const initDom = vnode => {
		dateId = parseInt(m.route.param('id'), 10)
		sets = _.flow(
					m.route.param, parseInt,
					remoteData.Dates.getSubSetIds,
					remoteData.Sets.getMany)('id')
		festivalId = _.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSuperId
				)('id')
				//console.log('DatesDetail initDom festivalId')
				//console.log(festivalId)
				//console.log(dateId)
		lineup = remoteData.Lineups.forFestival(festivalId)
				//console.log(lineup)
	}
	return {
	oninit: vnode => {
		/*
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
		*/
		initDom(vnode)
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Dates.getEventName(dateId)} 
		
			/>
			
		{remoteData.Dates.get(dateId) ? <DateVenueField id={dateId} /> : ''}
		{remoteData.Dates.get(dateId) ? <DateBaseField id={dateId} /> : ''}
		<FestivalCard seriesId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSeriesId,
				)('id')
			}
			festivalId={festivalId}
			eventId={_.flow(
				m.route.param, parseInt,
				remoteData.Dates.getSuperId
				)('id')
			}
		/>
		{ festivalId ? 
			<IntentToggle subjectObject={{subject: festivalId, subjectType: 7}} /> 
		: '' }
		
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
		{sets.length ? <FixedCardWidget header="Scheduled Sets">
			{
				sets
					.sort((a, b) => {
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
		</FixedCardWidget> : ''}
		{sets.length ? '' : <LineupWidget festivalId={festivalId} />}
			</WidgetContainer>
		
	</div>
}}
export default DateDetail;
