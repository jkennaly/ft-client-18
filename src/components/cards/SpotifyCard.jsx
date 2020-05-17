// src/components/cards/SpotifyCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';

const SpotifyCard = {
  view: ({ attrs }) => <a href={'https://open.spotify.com/search/' + attrs.fieldValue} target="_blank">
    <div class={"c44-card " + (attrs.uiClass ? attrs.uiClass : '')} >
      <div class="c44-fields">
        <ComposedNameField fieldValue={'Search Spotify for ' + attrs.fieldValue} />
      </div>
    </div>
    </a>
};

export default SpotifyCard;