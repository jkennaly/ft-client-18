// DaySelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const DaySelector = {
	oninit: () => {
	},
	view: ({ attrs }) =>
		<div class="ft-name-field">
			<label for="day">
		        {`Festival Day`}
		    </label>
			    <select id="ft-day-selector" name="day" class={attrs.dateId ? '' : 'hidden'} onchange={attrs.dayChange}>
			    	<option value={0} selected={ attrs.dayId ? '' : "selected"}>{`Select a day`}</option>
		      		{remoteData.Days.getMany(
							remoteData.Dates.getSubIds(attrs.dateId))
		      			.sort((a, b) => a.daysOffset - b.daysOffset)
			      		.map(s => <option value={s.id}>{s.name}</option>)
			      	}
		    </select>
		</div>
};

export default DaySelector;