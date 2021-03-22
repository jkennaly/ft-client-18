// src/components/cards/FlagCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'dayjs'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  AdminOverlay from '../cardOverlays/AdminOverlay.jsx'
import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

const defaultClick = attrs => () => 0

const status = [
  'N/A',
  'Opened',
  'Review',
  'Responded',
  'Closed',
  'Discussion',
  'Closed Over Objection'
]

const comment = attrs => attrs.messageArray.find(m => m.messageType === 1)

const FlagCard = vnode => {
  var showLong = false
  
  
  return {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      {attrs.discussFlag ? <AdminOverlay 
        discussFlag={attrs.discussFlag}
        asAdmin={attrs.asAdmin}
        asUser={attrs.asUser}
        flag={attrs.flag}
        popModal={attrs.popModal}
      /> : ''}
        <div class="ft-vertical-fields">
        {
          //console.log(`FlagCard attrs`, attrs)
        }
          <UserAvatarField data={attrs.flag.fromuser} userId={attrs.userId} />
          <span>{moment(attrs.flag.timestamp).utc().fromNow()}</span>
          <span>{status[attrs.flag.status]}</span>
        </div>
          <div class="ft-flag-subject">
            {subjectData.subjectDataField(attrs.flag.subjectType)}:{attrs.flag.subject}
          </div>
          <div class="ft-flag-content">
            {attrs.flag.content}
          </div>
          <div class="ft-flag-response">
            {attrs.flag.response}
          </div>
      </div>
    
}};

export default FlagCard;