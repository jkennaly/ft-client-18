// FestivalView.jsx


import m from 'mithril'

import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';

import {remoteData} from '../../store/data';



const nameReduce = targetId => (n, s) => n.length || s.id !== targetId ? n : s.name

const FestivalView = (auth) => { return {
	oninit: ({attrs}) => {if (attrs.titleSet) attrs.titleSet(`FestiGram Years`)},
	view: () => <div class="main-stage">

		<CardContainer>
		<FestivalCard eventId={'new'}/>
			
			{
				remoteData.Festivals.list
					.map(data => <FestivalCard  
						seriesId={data.series}
						festivalId={data.id}
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}
export default FestivalView;