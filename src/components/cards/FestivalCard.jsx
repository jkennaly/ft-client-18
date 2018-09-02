// FestivalCard.jsx

const m = require("mithril");

import  MainEventField from '../fields/MainEventField.jsx';
import {getAppContext} from '../../store/ui';

const FestivalCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => {m.route.set("/fests" + "/" + getAppContext() + '/' + attrs.eventId);}}>
      <div class="ft-fields">
        <MainEventField seriesId={attrs.seriesId} festivalId={attrs.festivalId} />
      </div>
    </div>
};

export default FestivalCard;