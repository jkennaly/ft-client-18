// Launcher.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


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

const artistData = ({fallback, festivalId, userId, search, recordCount, prefilter = x => x}) => {
	const searchMatches = search ? 
		smartSearch(remoteData.Artists.list.filter(prefilter), search.pattern, search.fields)
			.map(x => x.entry)
	 : remoteData.Artists.virgins().filter(prefilter)
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
	oninit: () => {
		auth.getFtUserId()
			.then(userId => Promise.all([remoteData.Messages.loadList(),
					remoteData.MessagesMonitors.loadList(),
					remoteData.Images.loadList(),
					remoteData.Series.loadList(),
					remoteData.Festivals.loadList(),
					remoteData.Dates.loadList(),
					remoteData.Days.loadList(),
					remoteData.Sets.loadList(),
					remoteData.Venues.loadList(),
					remoteData.Places.loadList(),
					remoteData.Lineups.loadList(),
			      	remoteData.ArtistPriorities.loadList(),
			      	remoteData.StagePriorities.loadList(),
			      	remoteData.ArtistAliases.loadList(),
					remoteData.Artists.loadList(),
					remoteData.Users.loadList(),
					remoteData.Intentions.loadList()])
				.then(x => userId)
			)
			.catch(err => m.route.set('/auth'))
	},
	view: () => <div class="main-stage">
		<LauncherBanner 
			title="FestivalTime Launcher" 
		/>
		<WidgetContainer>
			<FixedCardWidget header="My Festivals">
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
