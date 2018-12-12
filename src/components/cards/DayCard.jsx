// DayCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {remoteData} from '../../store/data'
import {getAppContext} from '../../store/ui';

const DayCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/days" + "/" + getAppContext() + '/' + attrs.eventId)}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={remoteData.Days.getEventName(attrs.eventId)} />
    </div>
    </div>
};

export default DayCard;