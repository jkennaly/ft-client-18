// FestivalCard.jsx

const m = require("mithril");

import  MainEventField from '../fields/MainEventField.jsx';
import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {getAppContext} from '../../store/ui';

const FestivalCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => {m.route.set("/fests" + "/" + getAppContext() + '/' + attrs.eventId + (attrs.eventId === 'new' && attrs.seriesId ? '/' + attrs.seriesId : ''));}}>
      <div class="ft-fields">
        {attrs.festivalId ? <MainEventField seriesId={attrs.seriesId} festivalId={attrs.festivalId} /> : <ComposedNameField fieldValue={'New Festival Year'} />}
      </div>
    </div>
};

export default FestivalCard;