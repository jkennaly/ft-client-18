// DateCard.jsx
// attrs:
//	eventId

const m = require("mithril");

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {remoteData} from '../../store/data'
import {getAppContext} from '../../store/ui';

const DateCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/dates" + "/" + getAppContext() + '/' + attrs.eventId)}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={remoteData.Dates.getEventName(attrs.eventId)} />
    </div>
    </div>
};

export default DateCard;

