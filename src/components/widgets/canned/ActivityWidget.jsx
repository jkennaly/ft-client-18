// ActivityWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import ActivityCard from '../../../components/cards/ActivityCard.jsx';
import SearchCard from '../../../components/cards/SearchCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';
import {remoteData, subjectData} from '../../../store/data';

const artistData = ({festivalId, userId, search, recordCount, prefilter}) => {
	const baseData = remoteData.Festivals.getResearchList(festivalId, userId)
		.filter(prefilter ? prefilter : x => true)
	const searchMatches = search ? 
		smartSearch(baseData, search.pattern, search.fields)
			.map(x => x.entry)
	 : baseData
	return _.take(searchMatches, recordCount)
}

const ActivityWidget = vnode => {
	var userId = 0
	const routeId = _.flow(m.route.param, parseInt)('id')
	var reviewing = false
	var subjectObject = {}
	var removed = []
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		view: (vnode) => <FixedCardWidget header="Recent Activity">
			{
				userId ? _.take(
					_.uniqBy(remoteData.Messages.recentDiscussionEvent(userId,
						remoteData.Festivals.getSubjectObject(vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param('id'), 10))), 
						v => '' + v.fromuser + '.' + v.messageType  + '.' + v.subjectType + '.' + v.subject)
						.sort((a, b) => {
							const am = moment(a.timestamp).utc()
							const bm = moment(b.timestamp).utc()
							return bm.diff(am)
						}
					), 5)
					.map(data => <ActivityCard 
						messageArray={[data]} 
						discusser={data.fromuser}
						rating={remoteData.Artists.getRating(data.subject, data.fromuser)}
						overlay={'discuss'}
						shortDefault={true}
						headline={subjectData.name(data.subject, data.subjectType)}
						headact={e => {
							if(data.subjectType === 2) m.route.set("/artists" + "/pregame" + '/' + data.subject)

						}}
						discussSubject={(s, me, r) => {
							subjectObject = _.clone(s)
							messageArray = _.clone(me)
							rating = r
							//console.log('ArtistDetail ArtistReviewCard discussSubject me length ' + me.length)
							discussing = true
						}}
					/>)
				: ''
			}
			</FixedCardWidget>	
}};

export default ActivityWidget;