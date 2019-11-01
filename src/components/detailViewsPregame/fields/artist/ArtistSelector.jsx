// ArtistSelector.jsx
import m from 'mithril'

import {remoteData} from '../../../../store/data'

const ArtistSelector = {
	oninit: () => {
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			<label for="artist">
		        {attrs.label ? attrs.label : `Artist`}
		    </label>
			    <select id="artist" name="artist" onchange={attrs.artistChange}>
			    	<option value={0} selected={!attrs.sel ? 'selected' : false}>{attrs.defaultText ? attrs.defaultText : `Select an Artist`}</option>
		      		{remoteData.Artists.list
		      			.sort((a, b) => a.name.localeCompare(b.name))
			      		.map(s => <option value={s.id} selected={attrs.sel && attrs.sel === s.id ? 'selected' : false}>{s.name}</option>)
			      	}
		    	</select>
		</div>
};

export default ArtistSelector;