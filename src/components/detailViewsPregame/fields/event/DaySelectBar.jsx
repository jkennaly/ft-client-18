// src/components/detailViewPregame/fields/event/DaySelectBar.jsx
import m from 'mithril'


import DayCard from '../../../../components/cards/DayCard.jsx'
import {remoteData} from '../../../../store/data'


const DaySelectBar = vnode => { 

	return {
		view: ({attrs}) => <div class="c44-card-container-horizontal">

			{
				/*
					horizontal card container for peer events
				*/
				remoteData.Days.getFiltered(d => d.date === attrs.dateId)
					.sort((a, b) => a.daysOffset - b.daysOffset)
					//.filter(x => console.log('days DaySelectBar', x) || true)
					.map(data => <DayCard 
						eventId={data.id}
						useShort={true}
						uiClass={data.id === attrs.currentId ? 'c44-card-selected' : ''}
						clickFunction={e => attrs.dayChange(e.target.value)}
					/>)
			}
	    </div>
}};

export default DaySelectBar;