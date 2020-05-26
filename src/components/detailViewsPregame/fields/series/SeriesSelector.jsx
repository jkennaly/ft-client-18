// SeriesSelector.jsx
import m from 'mithril'

import {remoteData} from '../../../../store/data'

const SeriesSelector = {
	view: ({ attrs }) => <div class="c44-name-field">
			<label for="c44-series-selector">
		        {`Festival Name`}
		    </label>
		    <select id="c44-series-selector" name="series" onchange={attrs.seriesChange}>
		    	<option value={0} selected={ attrs.seriesId ? '' : "selected"}>{`Select a festival`}</option>
	      		{remoteData.Series.getEventNamesWithIds()
	      			.filter(se => !attrs.scheduled || remoteData.Series.getSubSetIds(se[1]).length)
		      		.map(s => <option value={s[1]} selected={ attrs.seriesId === s[1]}>{s[0]}</option>)
		      	}
	    	</select>
		</div>
};

export default SeriesSelector;