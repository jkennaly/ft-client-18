// ArtistReviewCard.jsx

import m from 'mithril'
import _ from 'lodash'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import {remoteData} from '../../store/data';

const defaultClick = attrs => () => 0


const ArtistReviewCard = vnode => {
  var author = 0
  var year = 2000
  var rating = 0
  var comment = ''
  const initDom = ({attrs}) => {
    const rm = attrs.messageArray.filter(m => m.messageType === 2)
    const r = rm.length ? rm[0].content : 0
    const cm = attrs.messageArray.filter(m => m.messageType === 1)
    const c = cm.length ? cm[0].content : 0
    const am = attrs.messageArray.filter(m => m)
    const a = am.length ? am[0].fromuser : 0

    year = attrs.messageArray.reduce((y, m) => {
        const mYear = parseInt(_.join(_.take(m.timestamp, 4), ''), 10)
        const retVal = typeof mYear === 'number' && mYear > y ? mYear : y
        return retVal
    }, year)

    rating = r ? r : rating
    comment = c ? c : comment
    author = a ? a : author
    //m.redraw()
  }
  return {
  	oninit: () => {
  		remoteData.Lineups.loadList()
      remoteData.ArtistPriorities.loadList()
      remoteData.Users.loadList()
  	},
    oncreate: initDom,
    onupdate: initDom,
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
          <UserAvatarField data={author} />
          <span>{year}</span>
          <AverageRatingField averageRating={rating} />
          <span>{comment}</span>
      </div>
    
}};

export default ArtistReviewCard;