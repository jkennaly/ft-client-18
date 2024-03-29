// src/components/cards/SpotifyCard.jsx

import m from 'mithril'

import ComposedNameField from '../fields/ComposedNameField.js';

const SpotifyCard = {
  view: ({ attrs }) => <a href={'https://open.spotify.com/search/' + attrs.fieldValue} target="_blank">
    <div class={"ft-card " + (attrs.uiClass ? attrs.uiClass : '')} >
      <div class="ft-fields">
        <ComposedNameField fieldValue={'Search Spotify for ' + attrs.fieldValue} />
      </div>
    </div>
  </a>
};

export default SpotifyCard;