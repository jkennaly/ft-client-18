// EventPeerBar.jsx
import m from 'mithril'


import DayCard from '../../../../components/cards/DayCard.jsx'
import {subjectData} from '../../../../store/subjectData'


const EventPeerBar = vnode => { 

	return {
		view: ({attrs}) => <div class="ft-card-container-horizontal">
			{
				/*
					horizontal card container for peer events
				*/
				subjectData.peerEvents(attrs.event)
					.map(data => <DayCard 
						eventId={data.id}
						useShort={true}
					/>)
			}
	    </div>
}};

export default EventPeerBar;
