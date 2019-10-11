// DayCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {remoteData} from '../../store/data'


const DayCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/days" + "/pregame" + '/' + attrs.eventId)}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={ remoteData.Days[attrs.useShort ? 'getEventNameShort' : 'getEventName'](attrs.eventId)} />
    </div>
    </div>
};

export default DayCard;