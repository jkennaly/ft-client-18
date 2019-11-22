// DateDetail.jsx


import m from 'mithril'
import _ from 'lodash'
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

import DaySchedule from '../layout/DaySchedule.jsx';
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

const dates = remoteData.Dates
const messages = remoteData.Messages
const intentions = remoteData.Intentions
const places = remoteData.Places
const lineups = remoteData.Lineups

const id = () => parseInt(m.route.param('id'), 10)
const date = () => dates.get(id())
const dso = _.memoize(dateId => {return {subject: dateId, subjectType: DATE}})
const festivalId = dateId => dates.getSuperId(dateId)
const sets = () => {
	const dayIds = dates.getSubDayIds(id())
	return remoteData.Sets.getFiltered(s => dayIds.includes(s.day))
}
const user = _.memoize(attrs => _.isInteger(attrs.userId) ? attrs.userId : 0, attrs => attrs.userId)
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []
const lineup = lineups.forFestival



const DateDetail = {
	name: 'DateDetail',
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const dateId = parseInt(rParams.id, 10)
			//messages.forArtist(dateId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			if(dateId) return dates.subjectDetails({subject: dateId, subjectType: DATE})
		},
		oninit: ({attrs}) => {
			if (attrs.titleSet) attrs.titleSet(dates.getEventName(id()))

		},
	view: ({attrs}) => <div class="main-stage">
		{date() ? <DateVenueField id={id()} /> : ''}
		{date() ? <DateBaseField id={id()} /> : ''}
		<FestivalCard seriesId={(dates.getSeriesId(id())
						)
			}
			festivalId={festivalId(id())}
			eventId={(dates.getSuperId(id()))}
		/>
		{
		//show the intent toggle if:
			//there is a valid date id
			//the date has not ended
			//there is no checkin for the date 
		}
		{ date() && !dates.ended(id()) && !messages.implicit(dso(id())) ? 
			<IntentToggle 
				subjectObject={dso(id())}
				permission={roles(attrs).includes('user')}
			/> 
		: '' }
		{
		//show the checkin toggle if:
			//there is a valid date id
			//there is a valid user
			//the date has not ended
			//one of:
				//there is an implicit checkin for the date
				//there is an intent for the date
		}
		{ date() && 
			roles(attrs).includes('user') && 
			!dates.ended(id()) && 
			dates.active(id()) && (
				messages.implicit(dso(id())) ||
				intentions.find(dso(id()))
			) ? 
			<CheckinToggle 
				subjectObject={dso(id())}
				permission={roles(attrs).includes('user')}
				userId={user(attrs)}
			/> 
		: '' }
		
			{sets().length ? '' : <WidgetContainer>
		<LineupWidget festivalId={festivalId(id())} />
			</WidgetContainer>}
			{
				//console.log(`DateDetail sets ${sets().length}`, id())
			}
		{sets().length ? 
			<DaySchedule
				dateId={id()}
				sets={sets()}
				stages={places.getFiltered(s => s.festival === festivalId(id()))}
		/> : ''}
		
	</div>
}
export default DateDetail;
