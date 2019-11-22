// ResearchWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'

import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import SearchCard from '../../../components/cards/SearchCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';
import BannerButton from '../../ui/BannerButton.jsx';
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
	var reviewing = false
	var subjectObject = {}
	var removed = []
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		view: (vnode) => <FixedCardWidget 
			header="Festival Research" 
			button={/research/.test(m.route.get()) || !/fests/.test(m.route.get()) || !parseInt(m.route.param("id"), 10) ? '' : <BannerButton 
				icon={<i class="fas fa-clipboard-check"></i>}
				clickFunction={e => m.route.set(`/research?seriesId=${remoteData.Festivals.getSeriesId(parseInt(m.route.param("id"), 10))}&festivalId=${parseInt(m.route.param("id"), 10)}`)} 


			/>}

		>
			<ReviewModal 
				display={reviewing} 
				hide={sub => {if(sub) removed.push(sub.sub);reviewing = false;}}
				subject={subjectObject}
				user={vnode.attrs.userId}
		    />
			<SearchCard patternChange={patternChange} />

			{
				artistData({
					festivalId: vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param("id"), 10),
					userId: vnode.attrs.userId,
					search: pattern ? {pattern: [pattern], fields: {name: true}} : undefined, 
					recordCount: 10, 
					prefilter: data => !_.includes(removed, data.id)
				})
					.map(data => <ArtistCard 
						data={data}
						festivalId={vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param("id"), 10)}
						overlay={'research'}
						reviewSubject={s => {subjectObject = _.clone(s); reviewing = true;}}
					/>)
			}
		</FixedCardWidget>	
}};

export default ResearchWidget;