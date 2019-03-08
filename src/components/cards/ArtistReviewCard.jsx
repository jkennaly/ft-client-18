// ArtistReviewCard.jsx


import m from 'mithril'
import _ from 'lodash'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  DiscussOverlay from '../cardOverlays/DiscussOverlay.jsx'
import {remoteData} from '../../store/data';

const defaultClick = attrs => () => 0

const year = attrs => attrs.messageArray.reduce((y, m) => {
        const mYear = parseInt(_.join(_.take(m.timestamp, 4), ''), 10)
        const retVal = typeof mYear === 'number' && mYear > y ? mYear : y
        return retVal
    }, 2000)

const rating = attrs => {
    if(attrs.rating) return attrs.rating

    const rm = attrs.messageArray.filter(m => m.messageType === 2)
    const r = rm.length ? rm[0].content : 0
    return r
}

const comment = attrs => {

    const cm = attrs.messageArray.filter(m => m.messageType === 1)
    const c = cm.length ? cm[0].content : 0
    return c
}

const ArtistReviewCard = vnode => {
  var showLong = false
  
  return {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      {attrs.overlay === 'discuss' && attrs.discussSubject && attrs.messageArray ? <DiscussOverlay 
        discussSubject={attrs.discussSubject}
        messageArray={attrs.messageArray}
      /> : ''}
        <div class="ft-vertical-fields">
          <UserAvatarField data={attrs.reviewer} />
          <AverageRatingField averageRating={rating(attrs)} />
          <span>{year(attrs)}</span>
        </div>
          <span onclick={e => {
            //console.log('span click'); 
            e.stopPropagation(); 
            if(showLong) return 
            showLong = true; 
          }}>
            {!attrs.shortDefault || showLong || !comment(attrs) ? comment(attrs) : comment(attrs).substring(0, 50) + '...(+expand)'}
          </span>
      </div>
    
}};

export default ArtistReviewCard;