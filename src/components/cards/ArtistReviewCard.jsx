// ArtistReviewCard.jsx

const m = require("mithril");

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import {remoteData} from '../../store/data';

const defaultClick = attrs => () => 0


const ArtistReviewCard = vnode => {
  var author = ''
  var year = 2000
  var rating = 0
  var comment = ''
  const initDom = ({attrs}) => {
    const u = attrs.messageArray[0].fromuser
    const y = _.take(attrs.messageArray[0].timestamp, 4)
    const rm = attrs.messageArray.filter(m => m.messageType === 2)
    const r = rm.length ? rm[0].content : 0
    const cm = attrs.messageArray.filter(m => m.messageType === 1)
    const c = cm.length ? cm[0].content : 0
    author = u ? remoteData.Users.getName(u) : author
    year = y ? y : year
    rating = r ? r : rating
    comment = c ? c : comment
    m.redraw()
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
          <div class="ft-vertical-fields">
            <span>{author}</span>
            <span>{year}</span>
            
          </div>
          <AverageRatingField averageRating={rating} />
          <span>{comment}</span>
      </div>
    
}};

export default ArtistReviewCard;