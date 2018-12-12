// DateCard.jsx
// attrs:
//	eventId

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {remoteData} from '../../store/data'
import {getAppContext} from '../../store/ui';

const DateCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/dates" + "/" + getAppContext() + '/' + attrs.eventId + (attrs.eventId === 'new' && attrs.festivalId ? '/' + attrs.festivalId : ''))}>
      <div class="ft-fields">
        {attrs.eventId !== 'new' ? 
        <ComposedNameField fieldValue={remoteData.Dates.getEventName(attrs.eventId)} /> : 
        <ComposedNameField fieldValue={'New Date'} />}
    </div>
    </div>
};

export default DateCard;

