// FestivalSelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const FestivalSelector = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			<label for="ft-festival-selector">
		        {`Festival Year`}
		    </label>
		    <select id="ft-festival-selector" name="festival" class={attrs.seriesId ? '' : 'hidden'} onchange={attrs.festivalChange}>
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
