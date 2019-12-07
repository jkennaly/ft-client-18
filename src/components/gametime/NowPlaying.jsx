// src/components/gametime/NowPlaying.jsx

import m from 'mithril'
import _ from 'lodash'
import {remoteData} from '../../store/data'
import {subjectData} from '../../store/subjectData'
import SetCard from '../../components/cards/SetCard.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';

//sets associated with the subject object

const sets = remoteData. Sets
const dates = remoteData. Dates
const days = remoteData. Days
const festivals = remoteData. Festivals
const places = remoteData. Places

const event = () => {return {
	subject: parseInt(attrs.id, 10), 
	subjectType: DAY
}}

const setsD = (yid) => sets.getFiltered(s => s.day === yid)
	

	
const NowPlaying = () => {
	
	return {
		view: ({attrs}) => <div>
		
			<FixedCardWidget 
				header={`Now Playing`} 
				display={setsD(attrs.dayId)
					.filter(s => sets.active(s.id))[0]
					}>
			{
				setsD(attrs.dayId)
					.filter(s => sets.active(s.id))
					.map(s => <SetCard userId={attrs.userId} subjectObject={{subject: s.id, subjectType: SET}} />)

			}
			</FixedCardWidget>
		
			<FixedCardWidget 
				header={`Next Up`}
				display={sets.future(attrs.dayId).length} >
			{
				_.uniqBy(sets.future(attrs.dayId)
					.sort((a, b) => a.start - b.start), 
					'stage'
					)
					.map(s => <SetCard userId={attrs.userId} subjectObject={{subject: s.id, subjectType: SET}} />)

			}
			</FixedCardWidget>
		
			<FixedCardWidget 
				header={`Last Played`}
				display={setsD(attrs.dayId)
					.filter(s => sets.ended(s.id))[0]
					} >
			{
				_.uniqBy(setsD(attrs.dayId)
					.filter(s => sets.ended(s.id))
					.sort((a, b) => b.end - a.end), 
					'stage'
					)
				//.filter(x => console.log('Last Played', x) || true)
					.map(s => <SetCard 
						userId={attrs.userId} 
						subjectObject={{subject: s.id, subjectType: SET}} 
					/>)

			}
			</FixedCardWidget>
		
		</div>
}};
export default NowPlaying;