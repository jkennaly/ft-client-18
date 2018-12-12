// SpotifyCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';

const SpotifyCard = {
  view: ({ attrs }) => <a href={'https://open.spotify.com/search/results/' + attrs.fieldValue} target="_blank">
    <div class="ft-card" >
      <div class="ft-fields">
        <ComposedNameField fieldValue={'Search Spotify for ' + attrs.fieldValue} />
      </div>
    </div>
    </a>
};

export default SpotifyCard;