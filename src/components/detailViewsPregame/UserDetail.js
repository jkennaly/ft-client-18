
import m from 'mithril'
import Profile from './profiles/Profile'
import bites from '../../services/bites'
import nextFestival from '../../services/bites/user/events/nextFestival'
import favArtists from '../../services/bites/user/favorites/favArtists'
import mostDiscussed from '../../services/bites/user/counts/mostDiscussed'

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';

const {
	Users: users,
	Intentions: intentions,
	Festivals: festivals,
	Artists: artists,
	Sets: sets,
	Messages: messages
} = remoteData

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
			//console.log('ArtistDetail init', _.keys(attrs))
			const userId = parseInt(attrs.id, 10)
			if (attrs.titleSet) attrs.titleSet(users.get(userId) ? users.get(userId).name : '')
			return users.getLocalPromise(userId)
		},
	name: 'UserDetail',
	view: ({attrs}) => {
		//console.log('UserDetail attrComp', attrs, users.get(attrs.id))
		if(!users.get(attrs.id)) return ''
		const mapping = {
			own: attrs.id === attrs.userId,
			private: [
				{
					name: 'email',
					value: users.get(attrs.id).email,
					public: false
				}
			],
			mixed: [
				nextFestival(attrs.id, intentions, festivals),
				mostDiscussed(attrs.id, messages),
				favArtists(attrs.id, artists, sets, messages)
			],
			userData: {
				name: users.get(attrs.id).username,
				imgs: {
					profile: {
						src: users.get(attrs.id).picture	
					}
				},
				bites: bites({subject: attrs.id, subjectType: USER}, remoteData, subjectData)

			}
		}
		//console.log('UserDetail attrComp mapping', mapping)
	
		return m(Profile, mapping)
}}
export default UserDetail;