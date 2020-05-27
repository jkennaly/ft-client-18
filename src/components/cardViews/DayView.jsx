// DayView.jsx


import m from 'mithril'

import CardContainer from '../../components/layout/CardContainer.jsx';
import DayCard from '../../components/cards/DayCard.jsx';

import {remoteData} from '../../store/data';


const DayView = (auth) => { return {
	oninit: ({attrs}) => {if (attrs.titleSet) attrs.titleSet(`FestiGram Days`)},
	view: () => <div class="main-stage">
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
