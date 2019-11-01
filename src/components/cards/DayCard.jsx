// DayCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {remoteData} from '../../store/data'


const DayCard = {
  view: ({ attrs }) =>
    <div class={"ft-card " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set("/days" + "/pregame" + '/' + attrs.eventId)}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={ remoteData.Days[attrs.useShort ? 'getPartName' : 'getEventName'](attrs.eventId)} />
    </div>
    </div>
};

export default DayCard;