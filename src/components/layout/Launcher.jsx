// src/components/layout/Launcher.jsx
// Services


import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SearchCard from '../../components/cards/SearchCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

let pattern;
const patternChange = e => {
	pattern = e.target.value
	//console.log('ArtistSearchWidget pattern ' + pattern)
}

//console.log('Launcher running')
const Launcher = {
	name: 'Launcher',
	oninit: ({attrs}) => {
		if(attrs.titleSet) attrs.titleSet(`Client-44 Launcher`, m.route.get())
		//console.log('Launcher init')
	},
	view: ({attrs}) => <div class="c44-main-stage">
		<WidgetContainer>
			<FixedCardWidget header="Data">
			</FixedCardWidget>
		</WidgetContainer>
	</div>
}
export default Launcher;
