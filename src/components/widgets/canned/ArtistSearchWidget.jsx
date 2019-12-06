// src/components/widgets/canned/ArtistSearchWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import SearchCard from '../../../components/cards/SearchCard.jsx';
import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';
import {remoteData} from '../../../store/data';

const ArtistSearchWidget = vnode => {
	let pattern;
	let reviewing = false
	let subjectObject = {}
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		view: ({attrs}) => <FixedCardWidget header="Artist Search">
			<ReviewModal 
				display={reviewing} 
				hide={sub => {reviewing = false;}}
				subject={subjectObject}
				user={attrs.userId}
		    />
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
						reviewSubject={attrs.clickFunctionForData ? undefined : s => {subjectObject = _.clone(s); reviewing = true;}}
						clickFunction={attrs.clickFunctionForData(data)}
					/>)
			}
		</FixedCardWidget>	
}};

export default ArtistSearchWidget;