// src/components/layout/Discussion.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const Discussion = (vnode) => { return {
	oninit: ({attrs}) => {
			if (attrs.titleSet) attrs.titleSet(`Discussion`)
	},
	view: () => 
	<div class="ft-launcher-container">
		<div class="stage-banner-container">
		</div>
		{
			//subject image/name
			//comment/rating
			//each discussion point with 0 repyTo
			//threaded discussions, hidden behind Show button
				//starterPoint
				//discussionBlock
				//for each unread point:
					//leadPoint
					//highlightPoint
		}
		<div>
			<WidgetContainer>
				<FixedCardWidget header="Create Festivals">
				</FixedCardWidget>
			</WidgetContainer>
		</div>
	</div>
}}
export default Discussion;
