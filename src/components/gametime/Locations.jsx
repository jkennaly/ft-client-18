// src/components/gametime/Locations.jsx

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'
import {subjectCard} from '../../components/cards/subjectCard.js'
import SetCard from '../../components/cards/SetCard.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';



//sets
const rawPlaces = (subjectObject, count = 5) => {
	const places = subjectData.places(subjectObject)
	const placeSearchStrings = places
		.map(s => {return {subject: s.id, subjectType: PLACE}})
		//map to search string
		.map(so => _.assign({}, so, {name: subjectData.name(so)}))
	return pattern => _.take(smartSearch(placeSearchStrings,
		[pattern], {name: true}
		), count)
		.map(x => x.entry)
		.map(s => {return {
			name: s.name,
			clickFunction: e => {
				subjectData.checkIn(s)
			}
		}})
}
	
const Locations = () => {
	
	let pattern;
	var cardItems = []
	const searchObject = {
		setResults: function(pattern) {
			const placeItems = vnode && vnode.attrs && vnode.attrs.gtDate ? rawPlaces(attrs.subjectObject)(pattern) : []
			const placeGroup = [{name: 'Check into:'}, ...placeItems]
			cardItems = [...placeGroup]
		},
		getResults: function() {
			return cardItems
		}
	}
	const patternChange = e => {
		pattern = e.target.value
		searchObject.setResults(e.target.value)
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	return {
		view: ({attrs}) => <div>
			{console.log('Locations attrs', attrs)}
			<WidgetContainer>
		
				<FixedCardWidget header={`Check In`} display={true}>
					{// my current checkin
						`Current checkin: ${subjectData.name(subjectData.checkedIn({subject: attrs.userId, subjectType: USER}))}`
					}
					{subjectData.active(attrs.subjectObject) ? <div>

						{/* search/add bar <SearchCard patternChange={patternChange} /> */}
			
						

						{/* places select */}
					</div>

					: ''}
				</FixedCardWidget>
		
				<FixedCardWidget header={`Locations`} display={true}>
				{
					subjectData.places(attrs.subjectObject)
						//.filter(s => console.log('Locations place', s) || true)
						.sort((a, b) => {
							if(a.type - b.type) return a.type - b.type
							if(a.priority - b.priority) return a.priority - b.priority
							return 0
						})
						.map(s => subjectCard({subject: s.id, subjectType: PLACE}, {dayId: attrs.dayId}))

				}
				</FixedCardWidget>
			
				<FixedCardWidget header={`People`} display={true}>
				{

					subjectData.users(attrs.subjectObject)
						.map(s => {
							const mainSubject = {subject: s.id, subjectType: USER}
							const contextObject = subjectData.checkedIn(mainSubject)
							return subjectCard(mainSubject, {contextObject: contextObject, data: s})
						})

				}
				</FixedCardWidget>
		
			</WidgetContainer>
		</div>
}};
export default Locations;