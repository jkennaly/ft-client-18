// UserAvatarField.jsx
//attrs: userId

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data';



const UserAvatarField = vnode => {
	return {
		oninit: ({attrs}) => remoteData.Users.getLocalPromise(attrs.data)
			.catch(err=> {
				console.error('UserAvatarField data grab error', err)
			}),
		view: ({ attrs }) => <div class="ft-horizontal-fields">
			<img src={remoteData.Users.getPic(attrs.data)} />
			<div class="ft-vertical-fields">
	            <span>{remoteData.Users.getName(attrs.data)}</span>
	            
	        </div>
        </div>
}} ;

export default UserAvatarField;