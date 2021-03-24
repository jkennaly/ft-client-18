// src/components/cards/SubjectReviewCard.jsx


import m from 'mithril'
import _ from 'lodash'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import Icon from '../fields/Icon.jsx'
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  DiscussOverlay from '../cardOverlays/DiscussOverlay.jsx'
import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

const defaultClick = attrs => () => 0

const year = attrs => attrs.messageArray.reduce((y, m) => {
        const mYear = parseInt(_.join(_.take(m.timestamp, 4), ''), 10)
        const retVal = typeof mYear === 'number' && mYear > y ? mYear : y
        return retVal
    }, 2000)

const rating = attrs => {
    if(attrs.rating) return attrs.rating

    const rm = attrs.messageArray.find(m => m.messageType === 2)
    const r = rm ? rm.content : 
      subjectData.ratingBy(_.get(attrs.messageArray.find(m => m.messageType === 1), 'subject'), _.get(attrs.messageArray.find(m => m.messageType === 1), 'subjectType'), attrs.reviewer) || 
      attrs.messageArray.some(m => m.messageType === 1) && remoteData.Messages.maintainList({where: {and: [
        {messageType: RATING}, 
        {fromuser: attrs.reviewer},
        {subjectType: attrs.messageArray.find(m => m.messageType === 1).subjectType},
        {subject: attrs.messageArray.find(m => m.messageType === 1).subject}
        ]}})
    return r
}

const comment = attrs => attrs.messageArray.find(m => m.messageType === 1)

const classes = ({messageArray, userId, reviewer}) => {
  const reviewMessage = messageArray.find(m => m.messageType === 1)
  const reviewId = _.get(reviewMessage, 'id')
  const ownReview = reviewer === userId
  const reviewUnread = reviewId && !ownReview && remoteData.MessagesMonitors.unread(reviewId)

  return `ft-card-large ft-subject-review-card ${
    ownReview ? 'ft-own-content' :
    !reviewUnread ? 'ft-already-read' :
  '' }`
} 

const readAlready = attrs => !attrs.userId || (attrs.reviewer === attrs.userId || !remoteData.MessagesMonitors.unread(_.get(attrs.messageArray.find(m => m.messageType === 1), 'id')))
const markRead = attrs => <div class="ft-quarter ft-close-click" onclick={e => {
    //console.log('ft-quarter click', attrs.reviewer, attrs.userId, _.get(comment(attrs), 'id')) 
    //console.log('MessagesMonitors length ' + remoteData.MessagesMonitors.list.length)
    if(attrs.userId && attrs.reviewer !== attrs.userId && _.get(comment(attrs), 'id')) remoteData.MessagesMonitors.markRead(_.get(comment(attrs), 'id'))
    e.stopPropagation()
  }}>
  <Icon name="cancel-circle" />
</div>
const deleteOwn = attrs => <div class="ft-fifty-button ft-close-click" onclick={e => {
    //console.log('ft-quarter click', attrs.reviewer, attrs.userId, _.get(comment(attrs), 'id')) 
    //console.log('MessagesMonitors length ' + remoteData.MessagesMonitors.list.length)
    remoteData.Messages.delete(_.get(comment(attrs), 'id'))
    e.stopPropagation()
  }}>
  <Icon name="bin2"/>
</div>
const SubjectReviewCard = vnode => {
  var showLong = false
  
  return {
    view: ({ attrs }) =>
      <div class={classes(attrs)} onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      
        <div class="ft-vertical-fields-100-width">
        <div class="ft-card-above-overlay">
            { readAlready(attrs) ? '' : markRead(attrs)}
            { attrs.reviewer === attrs.userId ? deleteOwn(attrs) : ''}
        </div>
      <div class="ft-horizontal-fields">
      
        <div class="ft-vertical-fields" onclick={e => {
            //console.log('span click', attrs.reviewer); 
            e.stopPropagation(); 
            m.route.set(`/users/pregame/${attrs.reviewer}`)
          }}>
          <UserAvatarField data={attrs.reviewer} itemClicked={() => {}} userId={attrs.userId} />
          <AverageRatingField averageRating={rating(attrs)} />
          <span>{year(attrs)}</span>
        </div>

      <div class="ft-horizontal-fields c44-fg1">
      {attrs.overlay === 'discuss' && attrs.discussSubject && attrs.messageArray ? <DiscussOverlay 
        discussSubject={attrs.discussSubject}
        messageArray={attrs.messageArray}
      /> : ''}
          <span onclick={e => {
            //console.log('span click'); 
            e.stopPropagation(); 
            if(showLong) return 
            showLong = true; 
          }}>
            {!attrs.shortDefault || showLong || !comment(attrs) ? _.get(comment(attrs), 'content', '') : _.get(comment(attrs), 'content', '').substring(0, 50) + '...(+expand)'}
          </span>
          </div>
      </div>
      </div>
      </div>
    
}};

export default SubjectReviewCard;