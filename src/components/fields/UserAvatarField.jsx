// UserAvatarField.jsx
//attrs: userId

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data';

const author = attrs => {
    const u = attrs.data
    return remoteData.Users.getName(u)
}

const src = attrs => {
    const u = attrs.data
    return remoteData.Users.getPic(u)
}


const UserAvatarField = vnode => {
	return {
		view: ({ attrs }) => <div class="ft-horizontal-fields">
			<img src={src(attrs)} />
			<div class="ft-vertical-fields">
	            <span>{author(attrs)}</span>
	            
	        </div>
        </div>
}} ;

export default UserAvatarField;