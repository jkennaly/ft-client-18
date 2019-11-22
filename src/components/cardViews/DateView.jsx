// DateView.jsx


import m from 'mithril'

import CardContainer from '../../components/layout/CardContainer.jsx';
import DateCard from '../../components/cards/DateCard.jsx';

import {remoteData} from '../../store/data';



const DateView = (auth) => { return {
	oninit: ({attrs}) => {if (attrs.titleSet) attrs.titleSet(`FestiGram Dates`)},
	view: () => <div class="main-stage">
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
