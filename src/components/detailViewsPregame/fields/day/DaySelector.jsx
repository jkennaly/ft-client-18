// DaySelector.jsx
import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../../store/data'

const DaySelector = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) =>
		<div class="c44-name-field">
			<label for="c44-day-selector">
		        {`Festival Day`}
		    </label>
			    <select id="c44-day-selector" name="day" class={attrs.dateId ? '' : 'hidden'} onchange={attrs.dayChange}>
			    	<option value={0} selected={ attrs.dayId ? '' : "selected"}>{`Select a day`}</option>
		      		{remoteData.Days.getMany(
							remoteData.Dates.getSubIds(attrs.dateId))
	      			.filter(s => !attrs.scheduled || remoteData.Days.getSubSetIds(s.id).length)
		      			.sort((a, b) => a.daysOffset - b.daysOffset)
			      		.map(s => <option value={s.id} selected={ parseInt(attrs.dayId, 10) === s.id ? 'selected' : ''}>{s.name}</option>)
			      	}
		    </select>
		</div>
};

export default DaySelector;