// StageSelector.jsx
import m from 'mithril'

import {remoteData} from '../../../../store/data'

const StageSelector = {
	oninit: () => {
		remoteData.Festivals.loadList(),
		remoteData.Places.loadList()
	},
	view: ({ attrs }) => <div class="ft-name-field">
		<label for="stage">
	        {`Festival Stage`}
	    </label>
		    <select id="ft-stage-selector" name="stage" class={attrs.festivalId ? '' : 'hidden'} onchange={attrs.stageChange}>
		    	<option value={0} selected={"selected"}>{`Select a stage`}</option>
	      		{remoteData.Places.forFestival(attrs.festivalId)
	      			.filter(p => p.type === 1)
		      		.map(s => <option value={s.id}>{s.name}</option>)
		      	}
		    </select>
	</div >
};

export default StageSelector;