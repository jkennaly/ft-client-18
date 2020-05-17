// FestivalSelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const FestivalSelector = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="c44-name-field">
			<label for="c44-festival-selector">
		        {`Festival Year`}
		    </label>
		    <select id="c44-festival-selector" name="festival" class={attrs.seriesId ? '' : 'hidden'} onchange={attrs.festivalChange}>
		    	<option value={0} selected={ attrs.festivalId ? '' : "selected"}>{`Select a date`}</option>
	      		{remoteData.Festivals.getMany(remoteData.Series.getSubIds(attrs.seriesId))

	      			.filter(s => !attrs.scheduled || remoteData.Festivals.getSubSetIds(s.id).length)
	      			.sort((a, b) => b.year.localeCompare(a.year))
		      		.map(s => <option value={s.id} selected={ parseInt(attrs.festivalId, 10) === s.id ? 'selected' : ''}>{s.year}</option>)
		      	}
		    </select>
		</div>
};

export default FestivalSelector;