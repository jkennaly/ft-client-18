// src/componenets/cardOverlays/DiscussOverlay.jsx

import m from 'mithril'

import { remoteData } from '../../store/data';
import DiscussButton from './fifty/DiscussButton.jsx'
import globals from "../../services/globals"


const DiscussOverlay = {
  //oninit: ({attrs}) => console.log('DiscussOverlay init', attrs),
  view: ({ attrs }) => <div class="ft-card-overlay" onclick={attrs.fallbackClick}>
    <DiscussButton
      subjectType={globals.MESSAGE}
      subject={attrs.messageArray[0].id}
      discussSubject={attrs.discussSubject}
      messageArray={attrs.messageArray}
      rating={attrs.rating}
    />
  </div>

};

export default DiscussOverlay;