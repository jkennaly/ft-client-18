// src/components/cards/ReviewArrayCard.jsx

import m from 'mithril'
// Services
import moment from 'dayjs'


import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';

const ReviewArrayCard = vnode => {
  var showLong = false
  
  return {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : e => false}>
        <div class="ft-vertical-fields">
          <UserAvatarField data={attrs.review.author} userId={attrs.userId} />
          <AverageRatingField averageRating={attrs.review.rating} />
          <span>{moment(attrs.review.timestamp).fromNow()}</span>
        </div>
          <span onclick={e => {
            //console.log('span click'); 
            e.stopPropagation(); 
            if(showLong) return 
            showLong = true; 
          }}>
            {!attrs.shortDefault || showLong || !attrs.review.comment ? attrs.review.comment : attrs.review.comment.substring(0, 100) + '...(+expand)'}
          </span>
      </div>
    
}};

export default ReviewArrayCard;

