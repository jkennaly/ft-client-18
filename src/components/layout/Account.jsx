// src/components/layout/Account.jsx

import m from 'mithril'

import bucksLedger from '../../services/bites/user/account/profile/bucksLedger'
import bucksForm from '../../services/bites/user/account/profile/bucksForm'
import picForm from '../../services/bites/user/account/profile/picForm'
import Tract from '../tracts/Tract.jsx'
import ContentItem from '../detailViewsPregame/profiles/ContentItem'
import InlineTable from '../fields/InlineTable'

import {remoteData} from '../../store/data'

const {Users: users} = remoteData

const tractStates = {
	"EditProfile": false,
  "BucksHistory": false
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
    <Tract
      extracted={tractStates.BucksHistory}
      headline={`FestiBucks`}
      tractToggle={e => {
        tractStates.BucksHistory = !tractStates.BucksHistory
      }}
    >
      {m(InlineTable, bucksLedger(users))}
      {m(InlineTable, bucksForm(users))}
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