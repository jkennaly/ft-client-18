// src/components/widgets/canned/ResearchWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import smartSearch from 'smart-search'

import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import SearchCard from '../../../components/cards/SearchCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
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
			<SearchCard patternChange={patternChange} />

			{
				artistData({
					festivalId: vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param("id"), 10),
					userId: vnode.attrs.userId,
					search: pattern ? {pattern: [pattern], fields: {name: true}} : undefined, 
					recordCount: 10, 
					prefilter: data => !_.includes(removed, data.id)
				})
					
					//.sort((a, b) => b.time - a.time)
					.map(data => <ArtistCard 
						data={data}
						festivalId={vnode.attrs.festivalId ? vnode.attrs.festivalId : parseInt(m.route.param("id"), 10)}
						overlay={'research'}
						reviewSubject={(so) => vnode.attrs.popModal('review', {
							subjectObject: so
						})}
					/>)
			}
		</FixedCardWidget>	
}};

export default ResearchWidget;