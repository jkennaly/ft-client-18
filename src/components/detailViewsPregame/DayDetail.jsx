// DayDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';

const DayDetail = (auth) => { return {
	view: () => <div class="main-stage">
			<LauncherBanner 
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
				.map(data => <SetCard subjectObject={{subject: data.id, subjectType: subjectData.SET}}/>)
			}
		</CardContainer>
		
	</div>
}}
export default DayDetail;
