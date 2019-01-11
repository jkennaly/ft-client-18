// DateSelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const DateSelector = {
	oninit: () => {
		remoteData.Festivals.loadList(),
		remoteData.Dates.loadList()
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
					<label for="date">
				        {`Festival Date`}
				    </label>
					    <select id="ft-date-selector" class={attrs.festivalId ? '' : 'hidden'} onchange={attrs.dateChange}>
					    	<option value={0} selected={ attrs.dateId ? '' : "selected"}>{`Select a date`}</option>
				      		{_.flow(
				      			remoteData.Festivals.getSubIds,
				      			remoteData.Dates.getMany
				      		)(attrs.festivalId)
					      		.map(s => <option value={s.id}>{s.name}</option>)
					      	}
				    </select></div >
};

export default DateSelector;