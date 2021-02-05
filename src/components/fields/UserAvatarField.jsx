// src/components/fields/UserAvatarField.jsx
//attrs: userId

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data'

const { Users: users,
		Interactions: interactions
		} = remoteData

const UserAvatarField = vnode => {
	return {
		oninit: ({attrs}) => attrs.data && users.getLocalPromise(attrs.data)
			.catch(err=> {
				console.error('UserAvatarField data grab error', err)
			}),
		view: ({ attrs }) => <div 
			class="ft-horizontal-fields" 
			onclick={attrs.itemClicked ? attrs.itemClicked : () => m.route.set(`/users/pregame/${attrs.data}`)
		}>
		{
			//console.log('UserAvatarField unknown userid ' + attrs.userId, attrs)
	}
		{ attrs.data ? <div>
			{interactions.some(i => i.user === attrs.userId && i.type === FOLLOW && i.subjectType === USER && i.subject === attrs.data) ? <i 
				class="fas fa-user-plus" 
				style="color:orange;position:absolute;right:0;top:0;" 
				data-fa-transform="shrink-4 up-3.8 left-4"
			/> : ''}
			<img class="ft-user-avatar-image" src={users.getPic(attrs.data)} />
			<div class="ft-vertical-fields">
	            <span>{users.getName(attrs.data)}</span>
	            
	        </div>
	        </div>
	        : ''}
        </div>
}}

export default UserAvatarField;