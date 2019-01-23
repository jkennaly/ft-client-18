// FestivalSelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const FestivalSelector = {
	oninit: () => {
		remoteData.Festivals.loadList(),
		remoteData.Series.loadList()
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			<label for="festival">
		        {`Festival Year`}
		    </label>
			    <select  id="ft-festival-selector"name="festival" class={attrs.seriesId ? '' : 'hidden'} onchange={attrs.festivalChange}>
			    	<option value={0} selected={ attrs.festivalId ? '' : "selected"}>{`Select a date`}</option>
		      		{_.flow(
		      			remoteData.Series.getSubIds,
		      			remoteData.Festivals.getMany
		      		)(attrs.seriesId)
		      			.sort((a, b) => b.year.localeCompare(a.year))
			      		.map(s => <option value={s.id}>{s.year}</option>)
			      	}
		    </select></div >
};

export default FestivalSelector;