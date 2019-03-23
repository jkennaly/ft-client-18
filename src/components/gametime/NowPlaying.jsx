// NowPlaying.jsx

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'
import SetCard from '../../components/cards/SetCard.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';

//sets associated with the subject object
const sets = so => subjectData.sets(so)
	

	
const NowPlaying = () => {
	
	return {
		view: ({attrs}) => <div>
		
			<FixedCardWidget header={`Now Playing`} display={sets(attrs.subjectObject)
					.filter(s => subjectData.active({subject: s.id, subjectType: subjectData.SET}))[0]
					}>
			{
				sets(attrs.subjectObject)
					.filter(s => subjectData.active({subject: s.id, subjectType: subjectData.SET}))
					.map(s => <SetCard subjectObject={{subject: s.id, subjectType: subjectData.SET}} />)

			}
			</FixedCardWidget>
		
			<FixedCardWidget display={sets(attrs.subjectObject)
					.filter(s => s.day === attrs.dayId)
					.filter(s => subjectData.future({subject: s.id, subjectType: subjectData.SET}))[0]
					} header={`Next Up`}>
			{
				_.uniqBy(sets(attrs.subjectObject)
					.filter(s => s.day === attrs.dayId)
					.filter(s => subjectData.future({subject: s.id, subjectType: subjectData.SET}))
					.sort((a, b) => a.start - b.start), 
					'stage'
					)
					.map(s => <SetCard subjectObject={{subject: s.id, subjectType: subjectData.SET}} />)

			}
			</FixedCardWidget>
		
			<FixedCardWidget display={sets(attrs.subjectObject)
					.filter(s => s.day === attrs.dayId)
					.filter(s => subjectData.ended({subject: s.id, subjectType: subjectData.SET}))[0]
					} header={`Last Played`}>
			{
				_.uniqBy(sets(attrs.subjectObject)
					.filter(s => s.day === attrs.dayId)
					.filter(s => subjectData.ended({subject: s.id, subjectType: subjectData.SET}))
					.sort((a, b) => b.end - a.end), 
					'stage'
					)
				//.filter(x => console.log('Last Played', x) || true)
					.map(s => <SetCard subjectObject={{subject: s.id, subjectType: subjectData.SET}} />)

			}
			</FixedCardWidget>
		
		</div>
}};
export default NowPlaying;