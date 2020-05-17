// src/components/ui/LiveButton.jsx

import m from 'mithril'

import {remoteData} from '../../store/data.js'

const {
	Dates: dates,
	Festivals: festivals,
	Series: series
} = remoteData
const LiveButton = {
	view: ({ attrs }) =>
		<div class="c44-button-live" onclick={e => {
			m.route.set(`gametime/${DATE}/${attrs.date.id}`)
		}}>
			<span>LIVE<br />{
				festivals.getEventNameArray(attrs.date.festival)[0]
			}</span>
		</div>
};

export default LiveButton;