
import m from 'mithril'
import Profile from './profiles/Profile'
import Tract from '../tracts/Tract.jsx'
import {subjectCard} from '../cards/subjectCard'
import InteractionBar from '../ui/InteractionBar.jsx'
import bites from '../../services/bites'
import nextFestival from '../../services/bites/user/events/nextFestival'
import favArtists from '../../services/bites/user/favorites/favArtists'
import mostDiscussed from '../../services/bites/user/counts/mostDiscussed'
import WidgetContainer from '../../components/layout/WidgetContainer.jsx'

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';

const {
	Users: users,
	Intentions: intentions,
	Festivals: festivals,
	Artists: artists,
	Sets: sets,
	Messages: messages,
	Interactions: interactions
} = remoteData

const tractStates = {
	"Follows": false,
	"FollowedBy": false,
	"Blocks": false,
	"FollowingDetails": false
}
const UserDetail = { 
	preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const userId = parseInt(rParams.id, 10)
			//messages.forArtist(userId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			if(userId) return users.subjectDetails({subject: userId, subjectType: USER})
		},
	oninit: ({attrs}) => {
			//console.log('UserDetail init', _.keys(attrs))
			const userId = parseInt(attrs.id, 10)
			
			return users.getLocalPromise(userId)
				.then(() => {if (attrs.titleSet) attrs.titleSet(users.get(userId) ? users.get(userId).username : '')})
		},
	name: 'UserDetail',
	view: ({attrs}) => {
		//console.log('UserDetail attrComp', attrs, users.get(attrs.id))
		const user = users.get(attrs.id)
		if(!user) return ''
		const picField = user.picture
		const mapping = {
			own: attrs.id === attrs.userId,
			private: [
				{
					name: 'email',
					value: user.email,
					public: false
				}
			],
			mixed: [
				nextFestival(attrs.id, intentions, festivals),
				mostDiscussed(attrs.id, messages),
				favArtists(attrs.id, artists, sets, messages)
			],
			userData: {
				name: user.username,
				imgs: {
					profile: {
						src: picField ? picField : undefined	
					}
				},
				bites: bites({subject: attrs.id, subjectType: USER}, remoteData, subjectData)

			},
			interactive: attrs.id === attrs.userId ? m(Tract, {
					extracted: tractStates.FollowingDetails,
					headline: `Following and Blocking`,
			  		tractToggle: e => {
			  			tractStates.FollowingDetails = !tractStates.FollowingDetails
			  		}
			  	}, 
				m(Tract, {
					extracted: tractStates.Follows,
					headline: `Followed By ${user.username}`,
			  		tractToggle: e => {
			  			tractStates.Follows = !tractStates.Follows
			  		}
			  	}, 
			  		interactions
			  			.getFiltered({user: attrs.id, type: FOLLOW})
			  			.map(i => users.get(i.subject) ? subjectCard(i, {userId: attrs.id, data: users.get(i.subject)}) : '')

			  	), 
				m(Tract, {
					extracted: tractStates.FollowedBy,
					headline: `Followers Of ${user.username}`,
			  		tractToggle: e => {
			  			tractStates.FollowedBy = !tractStates.FollowedBy
			  		}
			  	}), 
				m(Tract, {
					extracted: tractStates.Blocks,
					headline: `Blocked By ${user.username}`,
			  		tractToggle: e => {
			  			tractStates.Blocks = !tractStates.Blocks
			  		}
			  	})
			) : m(InteractionBar, {
				targetId: user.id
			})
		}
		//console.log('UserDetail attrComp mapping', mapping)


		return m('.main-stage', {}, m('.c44-oys.c44-h-80vh', {}, m(Profile, mapping)))
}}
export default UserDetail;