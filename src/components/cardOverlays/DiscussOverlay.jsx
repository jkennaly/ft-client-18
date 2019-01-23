// DiscussOverlay.jsx

import m from 'mithril'

import {remoteData} from '../../store/data';
import DiscussButton from './fifty/DiscussButton.jsx'


const DiscussOverlay = {
  view: ({ attrs }) => <div class="ft-card-overlay" onclick={attrs.fallbackClick}>
    <DiscussButton 
      subjectType={10} 
      subject={attrs.messageArray[0].id}
      discussSubject={attrs.discussSubject}
      messageArray={attrs.messageArray}
      rating={attrs.rating}
    />
  </div>
    
};

export default DiscussOverlay;