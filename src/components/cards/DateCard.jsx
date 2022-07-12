// src/components/cards/DateCard.jsx

import m from 'mithril'

import ComposedNameField from '../fields/ComposedNameField.js';
import DateNail from '../fields/DateNail.jsx'
import { remoteData } from '../../store/data'

const DateCard = {
  view: ({ attrs }) =>
    <div class={"ft-card ft-card-date " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set("/dates" + "/pregame" + '/' + attrs.eventId + (attrs.eventId === 'new' && attrs.festivalId ? '/' + attrs.festivalId : ''))}>
      <div class="ft-fields-with-thumbnail">
        {attrs.eventId ? <DateNail
          eventId={attrs.eventId}
        /> : ''}
        <div class="ft-fields">
          {attrs.eventId !== 'new' ?
            <ComposedNameField fieldValue={remoteData.Dates.getEventName(attrs.eventId)} /> :
            <ComposedNameField fieldValue={'New Date'} />}
        </div>
      </div>
    </div>
};

export default DateCard;

