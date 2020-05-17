// StageSelector.jsx
import m from 'mithril'

import {remoteData} from '../../../../store/data'

const StageSelector = {
	oninit: ({attrs}) => {
	},
	view: ({ attrs }) => <div class="c44-name-field">
		<label for="c44-stage-selector">
	        {`Festival Stage`}
	    </label>
		    <select id="c44-stage-selector" name="stage" class={attrs.festivalId ? '' : 'hidden'} onchange={attrs.stageChange}>
		    	<option value={0} selected={attrs.stageId ? `` : "selected"}>{`Select a stage`}</option>
	      		{remoteData.Places.forFestival(attrs.festivalId)
	      			.filter(p => p.type === 1)
		      		.map(s => <option value={s.id} selected={ attrs.stageId === s.id ? 'selected' : ''}>{s.name}</option>)
		      	}
		    </select>
	</div >
};

export default StageSelector;