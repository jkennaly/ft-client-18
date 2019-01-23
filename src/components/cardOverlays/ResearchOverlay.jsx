// ResearchOverlay.jsx

import m from 'mithril'

import {remoteData} from '../../store/data';
import ReviewButton from './fifty/ReviewButton.jsx'
import ListenButton from './fifty/ListenButton.jsx'


const ResearchOverlay = {
  view: ({ attrs }) => <div class="ft-card-overlay">
    <ReviewButton 
      subjectType={2} 
      subject={attrs.artistId}
      reviewSubject={attrs.reviewSubject}
    />
    <ListenButton 
      subjectType={2} 
      subject={attrs.artistId}
    />
  </div>
    
};

export default ResearchOverlay;