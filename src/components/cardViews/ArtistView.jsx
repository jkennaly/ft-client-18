// ArtistView.jsx


import m from 'mithril'
//import _ from 'lodash'


import CardContainer from '../../components/layout/CardContainer.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';

import {remoteData} from '../../store/data';



const ArtistView = (auth) => { return {
	oninit: ({attrs}) => {if (attrs.titleSet) attrs.titleSet(`Client-44 Artists`)},
	view: () => <div class="main-stage">
		<CardContainer>
			{
				_.take(remoteData.Artists.list
				, 25)
				.map(data => <ArtistCard data={data}/>)
			}
		</CardContainer>
	</div>
}}
export default ArtistView;