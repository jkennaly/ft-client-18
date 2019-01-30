// LineupWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import SearchCard from '../../../components/cards/SearchCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';
import {remoteData} from '../../../store/data';

const artistData = ({festivalId, userId, search, recordCount, prefilter}) => {
	const baseData = remoteData.Festivals.getResearchList(festivalId, userId)
		.filter(prefilter ? prefilter : x => true)
	const searchMatches = search ? 
		smartSearch(baseData, search.pattern, search.fields)
			.map(x => x.entry)
	 : baseData
	return _.take(searchMatches, recordCount)
}

const LineupWidget = vnode => {
	var userId = 0
	const routeId = _.flow(m.route.param, parseInt)('id')
	var reviewing = false
	var subjectObject = {}
	var removed = []
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		view: (vnode) => <FixedCardWidget header="Festival Lineup">
			<ReviewModal 
				display={reviewing} 
				hide={sub => {if(sub) removed.push(sub.sub);reviewing = false;}}
				subject={subjectObject}
				user={userId}
		    />
			<SearchCard patternChange={patternChange} />


			{
				artistData({
					festivalId: vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param('id'), 10),
					search: pattern ? {pattern: [pattern], fields: {name: true}} : undefined, 
					recordCount: Infinity
				})
					.sort((a, b) => {
						const festivalId = vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param('id'), 10)
						const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, festivalId)
						const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, festivalId)
						if(aPriId === bPriId) return a.name.localeCompare(b.name)
						const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
						const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
						return aPriLevel - bPriLevel
					})
					.map(data => <ArtistCard 
						data={data}
						festivalId={vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param('id'), 10)}
					/>)
			}

		</FixedCardWidget>	
}};

export default LineupWidget;