// DayView.jsx


import m from 'mithril'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import DayCard from '../../components/cards/DayCard.jsx';

import {remoteData} from '../../store/data';


const DayView = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title="FestivalTime Days" 
			/>
		<CardContainer>
			{
				remoteData.Days.list
					//.filter(conference => conference.Day)
					.map(data => <DayCard 
						eventId={data.id}
						/>)
			}
		</CardContainer>
	</div>
}}
export default DayView;