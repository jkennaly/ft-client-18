// ArtistCard.jsx

const m = require("mithril");

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {getAppContext} from '../../store/ui';

const ArtistCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/artists" + "/" + getAppContext() + '/' + attrs.data.id)}>
      <div class="ft-fields">
        {attrs.data ? <ComposedNameField fieldValue={`${attrs.data.name}`} /> : ''}
      </div>
    </div>
};

export default ArtistCard;