// DiscussionCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  DiscussOverlay from '../cardOverlays/DiscussOverlay.jsx'
import {remoteData} from '../../store/data';

const defaultClick = attrs => () => 0

const displayComment = me => me.filter(m => m.messageType === 1 || m.messageType === 8)[0]

const year = attrs => {

    const cm = displayComment(attrs.messageArray)
    const mYear = moment(cm.timestamp).utc().fromNow()
    return mYear
}
const rating = attrs => {

    const rm = attrs.messageArray.filter(m => m.messageType === 2)
    const r = rm.length ? rm[0].content : 0
    return r
}

const comment = attrs => {

    const cm = displayComment(attrs.messageArray)
    const c = cm ? cm.content : ''
    return c
}

const DiscussionCard = vnode => {
  var showLong = false
    //m.redraw()
  
  return {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
        <div class="ft-vertical-fields">
          <UserAvatarField data={attrs.discusser} />
          <AverageRatingField averageRating={rating(attrs)} />
          <span>{year(attrs)}</span>
        </div>
          <span onclick={e => {
            //console.log('span click'); 
            e.stopPropagation(); 
            if(showLong) return 
            showLong = true; 
            m.redraw()
          }}>
            {!attrs.shortDefault || showLong || !comment(attrs) ? comment(attrs) : comment(attrs).substring(0, 50) + '...(+expand)'}
          </span>
      </div>
    
}};

export default DiscussionCard;