// SeriesSelector.jsx
const m = require("mithril");

import {remoteData} from '../../../../store/data'

const SeriesSelector = {
	oninit: () => {
		remoteData.Series.loadList()
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			<label for="series">
		        {`Festival Name`}
		    </label>
			    <select id="series" name="series" onchange={attrs.seriesChange}>
			    	<option value={0} selected="selected">{`Select a festival`}</option>
		      		{remoteData.Series.getEventNamesWithIds()
			      		.map(s => <option value={s[1]}>{s[0]}</option>)
			      	}
		    	</select>
		</div>
};

export default SeriesSelector;