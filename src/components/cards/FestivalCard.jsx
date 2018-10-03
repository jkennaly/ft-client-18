// FestivalCard.jsx

const m = require("mithril");

import  MainEventField from '../fields/MainEventField.jsx';
import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {getAppContext} from '../../store/ui';

import {remoteData} from '../../store/data';

const FestivalCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => {m.route.set("/fests" + "/" + getAppContext() + '/' + attrs.eventId + (attrs.eventId === 'new' && attrs.eventId ? '/' + attrs.eventId : ''));}}>
      <div class="ft-fields">
        {attrs.eventId !== 'new' ? <MainEventField seriesId={remoteData.Festivals.getSeriesId(attrs.eventId)} festivalId={attrs.eventId} /> : <ComposedNameField fieldValue={'New Festival Year'} />}
      </div>
    </div>
};

export default FestivalCard;