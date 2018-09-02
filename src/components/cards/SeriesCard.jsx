// SeriesCard.jsx

const m = require("mithril");

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {getAppContext} from '../../store/ui';

const SeriesCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/series" + "/" + getAppContext() + '/' + attrs.eventId)}>
      <div class="ft-fields">
        {attrs.data ? <ComposedNameField fieldValue={`${attrs.data.name}`} /> : ''}
      </div>
    </div>
};

export default SeriesCard;