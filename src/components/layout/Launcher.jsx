// Launcher.jsx
// Services


import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'

import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SearchCard from '../../components/cards/SearchCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const artistData = ({dataField, fallback, festivalId, userId, search, recordCount, prefilter = x => x}) => {
	const searchMatches = search ? 
		smartSearch(dataField.list.filter(prefilter), search.pattern, search.fields)
			.map(x => x.entry)
	 : dataField.virgins().filter(prefilter)
	return _.take(searchMatches, recordCount)
}

const Launcher = (vnode) => {
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}
	let discoveryArtists = []
	return {
		//onupdate: () => console.log('Launcher update'),
	view: () => <div class="main-stage">
		<LauncherBanner 
			title="FestivalTime Launcher" 
		/>
		<WidgetContainer>
			<FixedCardWidget header="My Festivals">
			{
				remoteData.Dates.checkedIn()
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
			{
				remoteData.Festivals.intended()
					.map(data => <FestivalCard 
						eventId={data.id}
					/>)
			}
			</FixedCardWidget>
			<FixedCardWidget header="Current Festival Dates">
			{
				remoteData.Dates.current()
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
			</FixedCardWidget>
			<FixedCardWidget header="Upcoming Festival Dates">
			{
				remoteData.Dates.soon()
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
			</FixedCardWidget>
			<FixedCardWidget header="Upcoming Festivals">
			{
				remoteData.Festivals.future()
					//.filter(x => console.log('Launcher Upcoming Festivals', x) || true)
					.map(data => <FestivalCard 
						eventId={data.id}
					/>)
			}
			</FixedCardWidget>
			<FixedCardWidget header="Artist Discovery">
			<SearchCard patternChange={patternChange} />
			{
				//three from next event
				//one ft chosen
				//one from fav event (future if possible, past if not)
				//balance (up to 5 total) from highest uncommented priority
				artistData({
					dataField: remoteData.Artists, 
					search: pattern ? {pattern: [pattern], fields: {name: true}} : undefined, 
					recordCount: 5
				})
					.map(data => <ArtistCard 
						data={data}
					/>)
			}
			</FixedCardWidget>
		</WidgetContainer>
	</div>
}}
export default Launcher;
