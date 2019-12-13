// src/components/widgets/canned/ArtistSearchWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'

import SearchCard from '../../../components/cards/SearchCard.jsx';
import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import {remoteData} from '../../../store/data';

const ArtistSearchWidget = vnode => {
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		view: ({attrs}) => <FixedCardWidget header="Artist Search">
			<SearchCard patternChange={patternChange} />
			{
				_.take(smartSearch(remoteData.Artists.getMany(
					remoteData.Lineups.getFiltered({festival: attrs.festivalId})
						.map(l => l.band)
					),
					[pattern], {name: true}
					), 5)
					.map(x => x.entry)
					.map(data => <ArtistCard 
						data={data}
						festivalId={attrs.festivalId}
						overlay={attrs.overlay ? attrs.overlay : 'none'}
						reviewSubject={attrs.clickFunctionForData || !attrs.popModal ? undefined : s => attrs.popModal('review', {subjectObject: s})}
						clickFunction={attrs.clickFunctionForData ? attrs.clickFunctionForData(data) : 
							attrs.clickFunction ? attrs.clickFunction :
							undefined}
					/>)
			}
		</FixedCardWidget>	
}};

export default ArtistSearchWidget;