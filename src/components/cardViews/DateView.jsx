// DateView.jsx


import m from 'mithril'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import {remoteData} from '../../store/data';



const DateView = (auth) => { return {
	oninit: () => {
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title="FestivalTime Dates" 
			/>
		<CardContainer>
			{
				remoteData.Dates.list
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}

export default DateView;
