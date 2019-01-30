// ArtistCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  CircleNail from '../fields/CircleNail.jsx';
import  ResearchOverlay from '../cardOverlays/ResearchOverlay.jsx'
import {remoteData} from '../../store/data';


const defaultClick = attrs => () => m.route.set("/artists" + "/pregame" + '/' + attrs.data.id)

const ArtistCard = {
  view: ({ attrs }) => <div 
    class="ft-card" 
    key={'artist-' + attrs.data.id} 
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

export default ArtistCard;