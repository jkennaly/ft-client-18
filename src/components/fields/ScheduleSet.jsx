// src/components/fields/ScheduleSet.jsx

import m from 'mithril'
import _ from 'lodash'


import ArtistNameField from './ArtistNameField.jsx';
import moment from 'dayjs'

import { remoteData } from '../../store/data';
import { subjectData } from '../../store/subjectData';
import globals from '../../services/globals.js';

const getRating = (subjectObject, author) => _.toInteger(_.get(messages.getFiltered(_.assign({ fromuser: author, messageType: globals.RATING }, subjectObject))
  .sort((a, b) => b.id - a.id), `[0].content`, 0))

const { Sets: sets, Messages: messages, Artists: artists } = remoteData
const ratingObject = (subjectObject, user) => {
  const author = user ? user : 0
  const { subject, subjectType } = subjectObject
  //the gold rating is the user's most recent rating for the subject
  const message = !author ? undefined : (getRating(subjectObject, author))
  const goldRating = message && message.content && parseInt(message.content, 10)
  //if(subject === 5102)console.log('ratingsObject gold', goldRating)
  if (goldRating) return _.assign({}, { author: author, rating: goldRating, color: 'gold' }, subjectObject)
  //the green rating is the average of the users relatedRatings
  const set = sets.get(subjectObject.subject)
  const artist = artists.get(_.get(set, 'band'))
  const otherSets = sets.getFiltered(s => s.band === set.band && s.id !== set.id)
  const relatedSubjects = [
    artist && artist.id ? { subject: artist.id, subjectType: globals.ARTIST } : undefined,
    ...otherSets.map(s => { return { subject: s.id, subjectType: globals.SET } })
  ].filter(x => x)
  //if(subject === 5102)console.log('ratingsObject relatedSubjects', relatedSubjects)
  const relatedRatings = relatedSubjects
    .map((so) => getRating(so, author))
    .filter(_.isInteger)
  const greenRating = relatedRatings.reduce((avg, r, i, arr) => avg + r / arr.length, 0)
  //if(subject === 5102)console.log('ratingsObject green', greenRating)
  if (greenRating) return _.assign({}, { author: author, rating: goldRating, color: 'forestgreen' }, subjectObject)
  //the black rating is the average of all avable ratings for the primary, or if none, the secondarties
  const primaryRatings = remoteData.Messages.getFiltered({ messageType: globals.RATING, subject: subject, subjectType: subjectType })
    .map(m => m && m.content && parseInt(m.content, 10))
    .filter(x => x)
  const secondaryRatings = _.uniqBy((primaryRatings.length ? [] : relatedSubjects)
    .map(sub => remoteData.Messages.getFiltered(_.assign({}, sub, { messageType: globals.RATING })))
    .reduce((pv, cv) => [...pv, ...cv], []),
    r => `${r.fromuser}.${r.subject}.${r.subjectType}`)
    .map(m => m && m.content && parseInt(m.content, 10))
    .filter(x => x)
  const allRatings = [...primaryRatings, ...secondaryRatings].filter(x => x)
  const blackRating = allRatings.length ? allRatings.reduce((avg, r, i, arr) => avg + r / arr.length, 0) : 0
  //if(subject === 5102)console.log('ratingsObject black', blackRating)

  return blackRating ? _.assign({}, { author: author, rating: blackRating, color: 'black' }, subjectObject) : _.assign({}, { author: author, rating: 0, color: 'black' }, subjectObject)
}
const fClass = (subjectObject, userId) => {
  const rating = ratingObject(subjectObject, userId)
  const strength = rating.color === 'black' ? 'weak' : 'strong'
  const feeling = !rating.rating ? '' :
    rating.rating < 3 ? 'hate' :
      rating.rating < 4 ? 'like' :
        'love'
  return feeling && `gt-feeling-${strength}-${feeling}` || 'gt-feeling-unsure'
}

const ScheduleSet = (vnode) => {
  //const elId = "schedule-set-" + (vnode.attrs.artistId ? 'artist-' + vnode.attrs.artistId : vnode.attrs.set.id)
  let baseMoment, startMoment, endMoment

  const initDom = vnode => {
    //console.log('ScheduleSet', vnode.attrs.set)
    //console.log(vnode.dom.style.bottom)
    const reference = !vnode.attrs.bottom ? 'top' : 'bottom'
    vnode.dom.style[reference] = '' + (vnode.attrs.set.start - (vnode.attrs.startOffset ? vnode.attrs.startOffset : 0)) + 'px'
    vnode.dom.style.height = '' + (vnode.attrs.set.end - vnode.attrs.set.start) + 'px'
    const feelingClass = fClass({ subject: vnode.attrs.set.id, subjectType: globals.SET }, vnode.attrs.userId)
    if (feelingClass) vnode.dom.classList.add(feelingClass)
    //console.log(vnode.dom.style.bottom)
  }

  return {
    oncreate: initDom,
    onupdate: initDom,
    view: ({ attrs }) => <div
      class="schedule-set"
      data-stage={attrs.set.stage}
      onclick={attrs.clickFunction ? attrs.clickFunction : () => 0}
      key={'_' + (attrs.set.id ? attrs.set.id : '' + attrs.set.band + '.' + attrs.set.start)}
    >
      <ArtistNameField artistId={attrs.set.band} />{(attrs.set.end - attrs.set.start) < 40 ? ` ${sets.getSetTimeText(attrs.set.id)}` : ''}
      <div>
        <span>
          {(attrs.set.end - attrs.set.start) >= 40 ? sets.getSetTimeText(attrs.set.id) : ''}
        </span>
      </div>
    </div>
  }
};

export default ScheduleSet;