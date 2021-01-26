// src/components/ui/canned/IntentToggle.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards


import Auth from '../../../services/auth.js'

import m from 'mithril'

import {remoteData} from '../../../store/data';
import ToggleControl from '../ToggleControl.jsx';

const IntentToggle = {
		view: ({attrs}) => <ToggleControl
			offLabel={attrs.offLabel ? attrs.offLabel : 'Not going'}
			onLabel={attrs.onLabel ? attrs.onLabel : 'I\'m going'}
			
			getter={() => remoteData.Intentions.forSubject(attrs.subjectObject).length}
			setter={newState => {
				//console.log('FestivalDetail ToggleControl setter')
				//console.log(newState)
				const intentionMethod = newState  ? 'setIntent' : 'clearIntent'
				remoteData.Intentions[intentionMethod](attrs.subjectObject)
			}}
			permission={attrs.permission}
			unauth={(new Auth()).login}

		/>
}

export default IntentToggle;