// src/components/fields/UserAvatarField.jsx
//attrs: userId

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data'



const UserAvatarField = vnode => {
	return {
		oninit: ({attrs}) => attrs.data && remoteData.Users.getLocalPromise(attrs.data)
			.catch(err=> {
				console.error('UserAvatarField data grab error', err)
			}),
		view: ({ attrs }) => <div 
			class="ft-horizontal-fields" 
			onclick={() => console.log('UserAvatarField clicked')}
			//onclick={attrs.itemClicked ? attrs.itemClicked : () => m.route.set(`/users/pregame/${attrs.data}`)}
			>
		{ attrs.data ? <div>
			<img class="ft-user-avatar-image" src={remoteData.Users.getPic(attrs.data)} />
			<div class="ft-vertical-fields">
	            <span>{remoteData.Users.getName(attrs.data)}</span>
	            
	        </div>
	        </div>
	        : ''}
        </div>
}} ;

export default UserAvatarField;