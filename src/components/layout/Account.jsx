// src/components/layout/Account.jsx

import m from 'mithril'

import picForm from '../../services/bites/user/account/profile/picForm'
import Tract from '../tracts/Tract.jsx'
import ContentItem from '../detailViewsPregame/profiles/ContentItem'

import {remoteData} from '../../store/data'

const {Users: users} = remoteData

const tractStates = {
	"EditProfile": false
}
const jsx = {
  //oninit: ({attrs}) => remoteData.Artists.getLocakPromise(attrs.data.id).catch(console.error),
  view: ({ attrs }) => <div   >
  	<Tract
  		extracted={tractStates.EditProfile}
  		headline={`Edit Profile`}
  		tractToggle={e => {
  			tractStates.EditProfile = !tractStates.EditProfile
  		}}
  	>
  		{m(ContentItem, picForm(attrs.userId, users))}
  	</Tract>
  </div>
    
};
const Account = {
  view: ({ attrs }) => {
    const mapping = {
      userId: attrs.userId,
      userRoles: attrs.userRoles
    }
    return m(jsx, mapping)
  }
}

export default Account