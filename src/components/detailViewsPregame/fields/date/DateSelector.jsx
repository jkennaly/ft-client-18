// DateSelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const DateSelector = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
					<label for="ft-date-selector">
				        {`Festival Date`}
				    </label>
					    <select id="ft-date-selector" class={attrs.festivalId ? '' : 'hidden'} onchange={attrs.dateChange}>
					    	<option value={0} selected={ attrs.dateId ? '' : "selected"}>{`Select a date`}</option>
				      		{(remoteData.Dates.getMany(
							remoteData.Festivals.getSubIds(attrs.festivalId))
						)
	      			.filter(s => !attrs.scheduled || remoteData.Dates.getSubSetIds(s.id).length)
					      		.map(s => <option value={s.id} selected={ parseInt(attrs.dateId, 10) === s.id}>{s.name}</option>)
					      	}
				    </select></div >
};

export default DateSelector;
