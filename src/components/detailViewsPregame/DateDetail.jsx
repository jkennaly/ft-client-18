// DateDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import IntentToggle from '../ui/canned/IntentToggle.jsx';
import CheckinToggle from '../ui/canned/CheckinToggle.jsx';
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
import {subjectData} from '../../store/subjectData';

const DateDetail = (auth) => { 
	var sets = []
	var lineup = []
	var festivalId = 0
	var dateId = 0

	const initDom = vnode => {
		dateId = parseInt(m.route.param('id'), 10)
		sets = (remoteData.Sets.getMany(
							remoteData.Dates.getSubSetIds(
								parseInt(
									m.route.param("id"))))
						)
		festivalId =(remoteData.Dates.getSuperId(
								parseInt(
									m.route.param("id")))
						)
				//console.log('DatesDetail initDom festivalId')
				//console.log(festivalId)
				//console.log(dateId)
		lineup = remoteData.Lineups.forFestival(festivalId)
				//console.log(lineup)
	}
	return {
	oninit: vnode => {
		initDom(vnode)
		//console.log('FestivalDetail init')
		
		festivalId && remoteData.Messages.loadForFestival(festivalId)
			.catch(err => {
				console.log('DateDetail Message load error')
				console.log(err)
			})
	
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Dates.getEventName(dateId)} 
		
			/>
			
		{remoteData.Dates.get(dateId) ? <DateVenueField id={dateId} /> : ''}
		{remoteData.Dates.get(dateId) ? <DateBaseField id={dateId} /> : ''}
		<FestivalCard seriesId={(remoteData.Dates.getSeriesId(
								parseInt(
									m.route.param("id")))
						)
			}
			festivalId={festivalId}
			eventId={(remoteData.Dates.getSuperId(
								parseInt(
									m.route.param("id")))
						)}
		/>
		{ festivalId && !subjectData.active({subject: dateId, subjectType: subjectData.DATE}) ? 
			<IntentToggle subjectObject={{subject: festivalId, subjectType: 7}} /> 
		: '' }
		{ dateId && subjectData.active({subject: dateId, subjectType: subjectData.DATE}) ? 
			<CheckinToggle subjectObject={{subject: dateId, subjectType: subjectData.DATE}} /> 
		: '' }
		
			<WidgetContainer>
		<FixedCardWidget header="Festival Days">
			{(remoteData.Days.getMany(
							remoteData.Dates.getSubIds(
								parseInt(
									m.route.param("id"))))
						)
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
				.map(data => <SetCard subjectObject={{subject: data.id, subjectType: subjectData.SET}}/>)
			}
		</FixedCardWidget> : ''}
		{sets.length ? '' : <LineupWidget festivalId={festivalId} />}
			</WidgetContainer>
		
	</div>
}}
export default DateDetail;
