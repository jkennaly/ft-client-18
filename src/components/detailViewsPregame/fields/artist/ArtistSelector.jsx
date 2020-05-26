// ArtistSelector.jsx
import m from 'mithril'

import {remoteData} from '../../../../store/data'

const ArtistSelector = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="c44-name-field">
			<label for="artist" class="c44-center">
		        {attrs.label ? attrs.label : `Artist`}
		    </label>
			    <select id="artist" name="artist" onchange={attrs.artistChange}>
			    	<option value={0} selected={!attrs.sel ? 'selected' : false}>{attrs.defaultText ? attrs.defaultText : `Select an Artist`}</option>
		      		{remoteData.Artists.list
		      			.sort((a, b) => a.name.localeCompare(b.name))
			      		.map(s => <option value={s.id}>{s.name}</option>)
			      	}
		    	</select>
		</div>
};

export default ArtistSelector;