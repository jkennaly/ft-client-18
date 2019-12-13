// src/components/detailViewsPregame/SetDetail.jsx

import m from 'mithril'
import _ from 'lodash'


import {remoteData} from '../../store/data';

const SetDetail = (auth) => { return {
	oninit: ({attrs}) => {
		if (attrs.titleSet) attrs.titleSet(remoteData.Sets.getEventName(parseInt(m.route.param('id'), 10)))
	},
	view: () => <div class="main-stage">
		<span>

		</span>
	</div>
}}
export default SetDetail;
