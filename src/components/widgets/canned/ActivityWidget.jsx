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
import  DiscussModal from '../../modals/DiscussModal.jsx';
import {remoteData} from '../../../store/data';
import {subjectData} from '../../../store/subjectData'

const artistData = ({festivalId, userId, search, recordCount, prefilter}) => {
	const baseData = remoteData.Festivals.getResearchList(festivalId, userId)
		.filter(prefilter ? prefilter : x => true)
	const searchMatches = search ? 
		smartSearch(baseData, search.pattern, search.fields)
			.map(x => x.entry)
	 : baseData
	return _.take(searchMatches, recordCount)
}

const getRecentActivity = (userId, festivalId) => _.take(
	_.uniqBy(remoteData.Messages.recentDiscussionEvent(userId,
		remoteData.Festivals.getSubjectObject(festivalId ? festivalId : parseInt(m.route.param('id'), 10))), 
		v => '' + v.fromuser + '.' + v.messageType  + '.' + v.subjectType + '.' + v.subject)
		.sort((a, b) => {
			const am = moment(a.timestamp).utc()
			const bm = moment(b.timestamp).utc()
			return bm.diff(am)
		}
	), 5)

const ActivityWidget = vnode => {
	const routeId = parseInt(m.route.param("id"), 10)
	var subjectObject = {}
	var messageArray = []
	var discussing = false
	var removed = []
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		view: (vnode) => <FixedCardWidget header="Recent Activity">

			{messageArray.length ? <DiscussModal
							display={discussing} 
							hide={sub => {discussing = false;}}
							subject={subjectObject}
							messageArray={messageArray}
							reviewer={messageArray.length ? messageArray[0].fromuser : 0}
							user={auth.userId()}
						/> : ''}
			{
				auth.userId() ? getRecentActivity(auth.userId(), vnode.attrs.festivalId)
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
							//console.log('ArtistDetail ArtistReviewCard discussSubject me length ' + me.length)
							discussing = true
						}}
					/>)
				: ''
			}
			</FixedCardWidget>	
}};

export default ActivityWidget;