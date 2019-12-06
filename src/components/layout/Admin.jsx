// src/components/layout/Admin.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'
import _ from 'lodash'

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const series = remoteData.Series
const festivals = remoteData.Festivals


const DATE_ANNOUNCED = 180
const LINEUP_ANNOUUNCED = 90
const SCHEDULE_ANNNOUNCED = 14

const upcomingFestivals = () => remoteData.Dates.upcomingDatedFestivals(LINEUP_ANNOUUNCED)
const upcomingLinedFestivals = () => {
	const festivalIds = upcomingFestivals().map(x => x.id)
	return festivals.getMany(_.uniq(remoteData.Lineups
		.getFiltered(l => festivalIds.includes(l.festival))
		.map(x => x.festival)
	))

}

const noLineup = () => {
	const festivalIds = upcomingFestivals().map(x => x.id)
	const linedFestivalIds = upcomingLinedFestivals().map(x => x.id)
	return festivals.getMany(_.difference(festivalIds, linedFestivalIds))

}

const artistPrisNeeded = () => remoteData.Lineups.allPrioritiesDefaultFestivals(
	remoteData.Dates.upcomingDatedFestivals(LINEUP_ANNOUUNCED)
		.map(f => f.id)
	)
const noFutureDates = () => series.noFutureDates(DATE_ANNOUNCED)
const unscheduledLineupFestivals = () => remoteData.Sets.unscheduledLineupFestivals(SCHEDULE_ANNNOUNCED)

const artistMissingDayFestivals = () => remoteData.Sets.artistMissingDayFestivals(SCHEDULE_ANNNOUNCED)
const artistMissingStageFestivals = () => remoteData.Sets.artistMissingStageFestivals(SCHEDULE_ANNNOUNCED)
const missingStageFestivals = () => remoteData.Places.missingStageFestivals(SCHEDULE_ANNNOUNCED)



		
const Admin = {
	name: 'Admin',
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			return Promise.all([
			series.remoteCheck(true),
			festivals.remoteCheck(true),
			remoteData.Lineups.remoteCheck(true),
			remoteData.Dates.acquireListUpdate(),
			remoteData.Days.acquireListUpdate(),
			remoteData.Sets.acquireListUpdate(),
			remoteData.Artists.acquireListUpdate(),
			remoteData.ArtistAliases.acquireListUpdate(),
			remoteData.Venues.remoteCheck(true),
			remoteData.Places.acquireListUpdate()
		])
				.catch(console.error)
			
		},
		oninit: ({attrs}) => {


		if (attrs.titleSet) attrs.titleSet(`FestiGram Admin`)
		},
	oncreate: ({dom}) => {
		const height = dom.clientHeight
		//console.log('ArtistDetail DOM height', height)
		const scroller = dom.querySelector('.ft-widget-container')
		scroller.style['height'] = `${height - 270}px`
		scroller.style['flex-grow'] = 0

	},
	view: () => <div class="main-stage">
		<div class="main-stage-content">
			<WidgetContainer>
				<FixedCardWidget header="Create Festivals" tall={true}>
					<SeriesCard eventId="new"/>
					<FestivalCard eventId="new"/>
					<DateCard eventId="new"/>
					<NavCard fieldValue="New Venue" action={() => m.route.set("/venues/pregame/new")}/>
					<NavCard fieldValue="Fix Artist Names" action={() => m.route.set("/artists/pregame/fix")}/>
					<NavCard fieldValue="Assign Artists to Festival" action={() => m.route.set("/fests/pregame/assignLineup")}/>
					<NavCard fieldValue="Assign Stages to Festival" action={() => m.route.set("/fests/pregame/assignStages")}/>
					<NavCard fieldValue="Assign Artists to Days" action={() => m.route.set("/sets/pregame/assignDays")}/>
					<NavCard fieldValue="Assign Artists to Stages" action={() => m.route.set("/sets/pregame/assignStages")}/>
					<NavCard fieldValue="Enter Set Times" action={() => m.route.set("/sets/pregame/assignTimes")}/>
				</FixedCardWidget>
			{
				noFutureDates().length ? <FixedCardWidget header="No Dates">
			{
				noFutureDates()
					.map(series => <SeriesCard 
						eventId={series.id} 
					/>)
			}
			</FixedCardWidget> : '' }
		

			{noLineup().length ? <FixedCardWidget header="No Lineup">
				{
					noLineup()
						.map(data => <FestivalCard
							eventId={data.id}
							route={`/fests/pregame/assignLineup?seriesId=${data.series}&festivalId=${data.id}`}
						/>)
				}
			</FixedCardWidget> : '' }

			{
				artistPrisNeeded().length ? <FixedCardWidget header="Artist Priorities Unassigned">
				{
					artistPrisNeeded()
						.map(data => <FestivalCard
							eventId={data.id}
							route={`/fests/pregame/assignLineup?seriesId=${data.series}&festivalId=${data.id}`}
						/>)
				}
			</FixedCardWidget> : '' }


			{
				missingStageFestivals().length ? <FixedCardWidget header="No stages">
			{
				missingStageFestivals()
					.map(data => <FestivalCard
						eventId={data.id}
						route={`/fests/pregame/assignStages?seriesId=${data.series}&festivalId=${data.id}`}
						/>)
			}
			</FixedCardWidget> : '' }

			{
				artistMissingDayFestivals().length ? <FixedCardWidget header="Artists Need Days">
			{
				artistMissingDayFestivals()
					.map(data => <FestivalCard
						eventId={data.id}
						route={`sets/pregame/assignDays?seriesId=${data.series}&festivalId=${data.id}`}
					/>)
			}
			</FixedCardWidget> : '' }

			{
				artistMissingStageFestivals().length ? <FixedCardWidget header="Artists Need Stages">
			{
				artistMissingStageFestivals()
					.map(data => <FestivalCard
						eventId={data.id}
						route={`/sets/pregame/assignStages?seriesId=${data.series}&festivalId=${data.id}`}
						/>)
			}
			</FixedCardWidget> : '' }

			{
				unscheduledLineupFestivals().length ? <FixedCardWidget header="Unscheduled Lineup">
			{
				unscheduledLineupFestivals()
					.map(data => <FestivalCard
						eventId={data.id}
						route={`/fests/pregame/assignLineup?seriesId=${data.series}&festivalId=${data.id}`}
					/>)
			}
			</FixedCardWidget> : '' }

			</WidgetContainer>
		</div>
	</div>
}
export default Admin;
