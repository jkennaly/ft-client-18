// ActivityCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  DiscussOverlay from '../cardOverlays/DiscussOverlay.jsx'
import {remoteData} from '../../store/data';

const displayComment = me => me.filter(m => m.messageType === 1 || m.messageType === 8)[0]

const id = ({messageArray}) => {

    const cm = displayComment(messageArray)
    const c = cm ? cm.id : ''
    return c
}

const year = ({messageArray}) => {

    const cm = displayComment(messageArray) ? displayComment(messageArray) : messageArray[0]
    const mYear = moment(cm.timestamp).utc().fromNow()
    return mYear
}

const comment = ({messageArray}) => {

    const cm = displayComment(messageArray)
    const c = cm ? cm.content : ''
    return c
}


const ActivityCard = vnode => {
  var showLong = false
    //m.redraw()
  

  const defaultClick = e => {
    //console.log('span click'); 
    e.stopPropagation()
    if(showLong) return 
    showLong = true
    m.redraw()
  }
  return {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick}>
        {attrs.overlay === 'discuss' && attrs.discussSubject && attrs.messageArray ? <DiscussOverlay 
          discussSubject={attrs.discussSubject}
          messageArray={attrs.messageArray}
          headline={attrs.headline}
          rating={attrs.rating}
          fallbackClick={defaultClick}
        /> : ''}
        <div class="ft-vertical-fields ft-flex-grow">
          {attrs.headline ? <div class="ft-horizontal-fields ft-card-above-overlay">
            <span 
              class="ft-card-title"
              onclick={attrs.headact ? attrs.headact : () => 0}
              >{attrs.headline}</span>
              <div class="quarter" onclick={e => {
                //console.log('quarter click') 
                //console.log('MessagesMonitors length ' + remoteData.MessagesMonitors.list.length)
                remoteData.MessagesMonitors.markRead(id(attrs))
                e.stopPropagation()
                m.redraw()
              }}><i class="fas fa-times"/></div>
            </div> : ''}
          <div class="ft-horizontal-fields ft-flex-grow">
            <div class="ft-vertical-fields">
              <UserAvatarField data={attrs.discusser} />
              {attrs.rating ? <AverageRatingField averageRating={attrs.rating} /> : ''}
              <span>{year(attrs)}</span>
            </div>
              <span class="ft-flex-grow" onclick={defaultClick}>
                {!attrs.shortDefault || showLong || !comment(attrs) ? comment(attrs) : comment(attrs).substring(0, 50) + '...(+expand)'}
              </span>
          </div>
        </div>
      </div>
    
}};

export default ActivityCard;