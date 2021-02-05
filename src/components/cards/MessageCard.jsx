// src/components/cards/MessageCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import  UserAvatarField from '../fields/UserAvatarField.jsx';
import {remoteData} from '../../store/data';




const MessageCard = {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : e => true}>

          <div class="ft-horizontal-fields ft-flex-grow">
            <div class="ft-vertical-fields">
              <UserAvatarField data={attrs.message.fromuser} userId={attrs.userId} />
              <span>{moment(attrs.message.timestamp).utc().fromNow()}</span>
            </div>
              <span class="ft-flex-grow">
                {attrs.message.content}
              </span>
          </div>
      </div>
    
}

export default MessageCard;