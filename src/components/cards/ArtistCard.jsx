// src/components/cards/ArtistCard.jsx

import m from 'mithril'

import ComposedNameField from '../fields/ComposedNameField.js';
import NameField from '../fields/NameField.js';
import CircleNail from '../fields/CircleNail.jsx';
import ResearchOverlay from '../cardOverlays/ResearchOverlay.jsx'
import { remoteData } from '../../store/data';


const { Artists: artists } = remoteData


const defaultClick = attrs => () => m.route.set("/artists" + "/pregame" + '/' + attrs.data.id)

const jsx = {
  //oninit: ({attrs}) => remoteData.Artists.getLocakPromise(attrs.data.id).catch(console.error),
  view: ({ attrs }) => <div
    class={"ft-card ft-card-artist " + (attrs.uiClass ? attrs.uiClass : '')}
    key={attrs.data ? 'artist-' + attrs.data.id : ''}
    onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}
  >
    <div class="ft-fields-with-thumbnail">
      {attrs.overlay === 'research' && attrs.data ? <ResearchOverlay
        artistId={attrs.data.id}
        reviewSubject={attrs.reviewSubject}
      /> : ''}
      {attrs.data ? <CircleNail
        subjectType={2}
        subject={attrs.data.id}
      /> : ''}
      <div class="ft-vertical-fields">
        <div class="ft-fields">
          {attrs.data ? <ComposedNameField fieldValue={`${attrs.data.name}`} /> : ''}
        </div>
        {attrs.festivalId ? <div class="ft-set-diff-fields">
          <NameField fieldValue={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(attrs.data.id, attrs.festivalId))} />
        </div> : ''}
      </div>
    </div>
  </div>

};
const ArtistCard = {
  oninit: (vnode) => {
    return vnode.attrs.subjectObject && artists.subjectDetails(vnode.attrs.subjectObject)
  },
  view: ({ attrs }) => {
    //console.log('ArtistCard attrs', attrs)
    const mapping = {
      uiClass: attrs.uiClass,
      subjectObject: attrs.subjectObject,
      data: artists.get(attrs.subjectObject ? attrs.subjectObject.subject : attrs.data ? attrs.data.id : {}),
      festivalId: attrs.festivalId,
      reviewSubject: attrs.reviewSubject,
      overlay: attrs.overlay,
      clickFunction: attrs.clickFunction
    }
    return m(jsx, mapping)
  }
}


export default ArtistCard;
