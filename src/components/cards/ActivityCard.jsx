// src/components/cards/ActivityCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  DiscussOverlay from '../cardOverlays/DiscussOverlay.jsx'
import  UserCard from '../cards/UserCard.jsx'
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

const classes = ({messageArray, userId, discusser}) => {
  const reviewMessage = messageArray.find(m => m.messageType !== 2)
  const reviewId = _.get(reviewMessage, 'id')
  const ownReview = userId && discusser === userId
  const reviewUnread = reviewId && !ownReview && remoteData.MessagesMonitors.unread(reviewId)
  //console.log('ActivityCard classes', userId, ownReview, reviewUnread, reviewMessage)
  return `c44-card-large ${
    ownReview ? 'c44-own-content' :
    !reviewUnread ? 'c44-already-read' :
  '' }`
} 
const ActivityCard = vnode => {
  var showLong = false
  

  const defaultClick = e => {
    //console.log('span click'); 
    e.stopPropagation()
    if(showLong) return 
    showLong = true
  }
  return {
    view: ({ attrs }) =>
      <div 
        class={classes(attrs)} 
        onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick}
      >
      {
        //console.log('ActivityCard discusser user', attrs.discusser, attrs.userId)
      }
        {attrs.overlay === 'discuss' && attrs.discussSubject && attrs.messageArray ? <DiscussOverlay 
          discussSubject={attrs.discussSubject}
          messageArray={attrs.messageArray}
          headline={attrs.headline}
          rating={attrs.rating}
          fallbackClick={defaultClick}
        /> : ''}
        <div class="c44-vertical-fields c44-flex-grow">
          <div class="c44-horizontal-fields c44-card-above-overlay">
            {attrs.headline ? <span 
              class="c44-card-title"
              onclick={attrs.headact ? attrs.headact : () => 0}
              >{attrs.headline}</span> : ''}
              {attrs.discusser === attrs.userId || !remoteData.MessagesMonitors.unread(id(attrs)) ? '' : <div class="c44-quarter c44-close-click" onclick={e => {
                //console.log('c44-quarter click') 
                //console.log('MessagesMonitors length ' + remoteData.MessagesMonitors.list.length)
                if(attrs.discusser !== attrs.userId) remoteData.MessagesMonitors.markRead(id(attrs))
                e.stopPropagation()
              }}>
              <i class="fas fa-times"/>
            </div>}
          </div>
          <div class="c44-horizontal-fields c44-flex-grow">
            <div class="c44-vertical-fields c44-card-above-overlay">
              <UserAvatarField data={attrs.discusser} itemClicked={e => {
                attrs.popModal('option', {
                  headerCard: <UserCard 
                    contextObject={{subjectType: USER, subject: attrs.discusser}} 
                    data={remoteData.Users.get(attrs.discusser)} 
                    small={true}
                  />,
                  options: remoteData.Users.interactOptions(attrs.discusser)
              })}} />
              {attrs.rating ? <AverageRatingField averageRating={attrs.rating} /> : ''}
              <span>{year(attrs)}</span>
            </div>
              <span class="c44-flex-grow" onclick={defaultClick}>
                {!attrs.shortDefault || showLong || !comment(attrs) ? comment(attrs) : comment(attrs).substring(0, 50) + '...(+expand)'}
              </span>
          </div>
        </div>
      </div>
    
}};

export default ActivityCard;