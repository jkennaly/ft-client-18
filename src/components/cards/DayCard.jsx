// src/components/cards/DayCard.jsx

import m from 'mithril'

import ComposedNameField from '../fields/ComposedNameField.js';
import { remoteData } from '../../store/data'


const DayCard = {
  view: ({ attrs }) =>
    <div class={"ft-card ft-card-day " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set("/days" + "/pregame" + '/' + attrs.eventId)}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={remoteData.Days[attrs.useShort ? 'getPartName' : 'getEventName'](attrs.eventId)} />
      </div>
    </div>
};

export default DayCard;
