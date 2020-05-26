// src/components/cards/ArtistCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  CircleNail from '../fields/CircleNail.jsx';
import  ResearchOverlay from '../cardOverlays/ResearchOverlay.jsx'
import {remoteData} from '../../store/data';


const defaultClick = attrs => () => m.route.set("/artists" + "/pregame" + '/' + attrs.data.id)

const ArtistCard = {
  //oninit: ({attrs}) => remoteData.Artists.getLocakPromise(attrs.data.id).catch(console.error),
  view: ({ attrs }) => <div 
    class={"c44-card c44-card-artist " + (attrs.uiClass ? attrs.uiClass : '')} 
    key={'artist-' + (attrs.data ? attrs.data.id : attrs.subject)} 
    onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}
  >
    <div class="c44-fields-with-thumbnail">
      {attrs.overlay === 'research' && attrs.data ? <ResearchOverlay 
        artistId={attrs.data.id}
        reviewSubject={attrs.reviewSubject}
      /> : ''}
      {attrs.data ? <CircleNail 
        subjectType={2} 
        subject={attrs.data.id}
      /> : ''}
      <div class="c44-vertical-fields">
        <div class="c44-fields">
          {attrs.data ? <ComposedNameField fieldValue={`${attrs.data.name}`} /> : ''}
        </div>
        {attrs.festivalId ? <div class="c44-set-diff-fields">
          <NameField fieldValue={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(attrs.data.id, attrs.festivalId))} />
        </div> : ''}
      </div>
    </div>
  </div>
    
};

export default ArtistCard;