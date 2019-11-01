// SetDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';

import {remoteData} from '../../store/data';

const SetDetail = (auth) => { return {
	oninit: () => {
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Sets.getEventName(parseInt(m.route.param('id'), 10))}  
			/>
		<span>

		</span>
	</div>
}}
export default SetDetail;
