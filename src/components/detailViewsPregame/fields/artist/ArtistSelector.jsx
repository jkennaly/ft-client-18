// ArtistSelector.jsx
const m = require("mithril");

import {remoteData} from '../../../../store/data'

const ArtistSelector = {
	oninit: () => {
		remoteData.Artists.loadList()
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			<label for="artist">
		        {attrs.label ? attrs.label : `Artist`}
		    </label>
			    <select id="artist" name="artist" onchange={attrs.artistChange}>
			    	<option value={0} selected="selected">{attrs.defaultText ? attrs.defaultText : `Select an Artist`}</option>
		      		{remoteData.Artists.list
		      			.sort((a, b) => a.name.localeCompare(b.name))
			      		.map(s => <option value={s.id}>{s.name}</option>)
			      	}
		    	</select>
		</div>
};

export default ArtistSelector;