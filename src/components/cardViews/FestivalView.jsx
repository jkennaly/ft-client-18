// FestivalView.jsx


import m from 'mithril'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';

import {remoteData} from '../../store/data';



const nameReduce = targetId => (n, s) => n.length || s.id !== targetId ? n : s.name

const FestivalView = (auth) => { return {
	oninit: () => {
		remoteData.Festivals.loadList()
		remoteData.Series.loadList()
	},
	view: () => <div class="main-stage">
		
			<LauncherBanner 
				title="FestivalTime Years" 
			/>
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