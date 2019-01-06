// ResearchWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import {remoteData} from '../../../store/data';

const ResearchWidget = vnode => {
	var userId = 0
	const festivalId = _.flow(m.route.param, parseInt)('id')
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		view: (vnode) => <FixedCardWidget header="Festival Research">
				{
					(userId ? remoteData.Festivals.getResearchList(festivalId) : [])
						.map(data => <ArtistCard 
							data={data}
							festivalId={festivalId}
						/>)
				}
		</FixedCardWidget>	
}};

export default ResearchWidget;