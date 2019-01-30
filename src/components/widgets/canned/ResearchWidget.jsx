// ResearchWidget.jsx

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
		.filter(prefilter)
	const searchMatches = search ? 
		smartSearch(baseData, search.pattern, search.fields)
			.map(x => x.entry)
	 : baseData
	return _.take(searchMatches, recordCount)
}

const ResearchWidget = vnode => {
	var userId = 0
	const routeId = _.flow(m.route.param, parseInt)('id')
	var festivalId = routeId ? routeId : 0
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
		onupdate: vnode => {
			if(vnode.attrs.festivalId && vnode.attrs.festivalId !== festivalId) {
				festivalId = vnode.attrs.festivalId
				m.redraw()
			}
		},
		view: (vnode) => <FixedCardWidget header="Festival Research">
			<ReviewModal 
				display={reviewing} 
				hide={sub => {if(sub) removed.push(sub.sub);reviewing = false;}}
				subject={subjectObject}
				user={userId}
		    />
			<SearchCard patternChange={patternChange} />

			{
				artistData({
					festivalId: festivalId,
					userId: userId,
					search: pattern ? {pattern: [pattern], fields: {name: true}} : undefined, 
					recordCount: 10, 
					prefilter: data => !_.includes(removed, data.id)
				})
					.map(data => <ArtistCard 
						data={data}
						festivalId={festivalId}
						overlay={'research'}
						reviewSubject={s => {subjectObject = _.clone(s); reviewing = true;}}
					/>)
/*
				 {
				_.take(smartSearch(remoteData.Artists.forFestival(attrs.festivalId),
					[pattern], {name: true}
					), 10)
					.map(x => x.entry)
					.map(data => <ArtistCard 
						data={data}
						festivalId={attrs.festivalId}
						overlay={attrs.userId ? 'research' : 'none'}
						reviewSubject={s => {subjectObject = _.clone(s); reviewing = true;}}
					/>)
			}
			{
				(festivalId ? _.take(remoteData.Festivals.getResearchList(festivalId, userId)
					.filter(data => !_.includes(removed, data.id)), 10) : [])
					.map(data => <ArtistCard 
						data={data}
						festivalId={festivalId}
						overlay={'research'}
						reviewSubject={s => {subjectObject = _.clone(s); reviewing = true;}}
					/>)
			}
			{
				(artistData({
					festivalId: festivalId,
					userId: userId,
					search: , 
					recordCount: , 
					prefilter: 
				})
				 _.take(remoteData.Festivals.getResearchList(festivalId, userId)
					.filter(data => !_.includes(removed, data.id)), 10))
					.map(data => <ArtistCard 
						data={data}
						festivalId={festivalId}
						overlay={'research'}
						reviewSubject={s => {subjectObject = _.clone(s); reviewing = true;}}
					/>)
			}
					*/
			}
		</FixedCardWidget>	
}};

export default ResearchWidget;