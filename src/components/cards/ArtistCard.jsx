// ArtistCard.jsx

const m = require("mithril");

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import {remoteData} from '../../store/data';
import {getAppContext} from '../../store/ui';

const defaultClick = attrs => () => m.route.set("/artists" + "/" + getAppContext() + '/' + attrs.data.id)

const ArtistCard = {
	oninit: () => {
		remoteData.Lineups.loadList()
		remoteData.ArtistPriorities.loadList()
	},
  view: ({ attrs }) =>
    <div class="ft-card" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      <div class="ft-fields">
        {attrs.data ? <ComposedNameField fieldValue={`${attrs.data.name}`} /> : ''}
      </div>
      {attrs.festivalId ? <div class="ft-set-diff-fields">
        <NameField fieldValue={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(attrs.data.id, attrs.festivalId))} />
      </div> : ''}
    </div>
    
};

export default ArtistCard;