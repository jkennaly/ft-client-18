// Admin.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'

import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const Admin = (vnode) => { 

	let artistPrisNeeded;
	let noFutureDates;
	let missingStageFestivals;
	let artistMissingDayFestivals;
	let artistMissingStageFestivals;
	let unscheduledLineupFestivals;
	const DATE_ANNOUNCED = 180
	const LINEUP_ANNOUUNCED = 90
	const SCHEDULE_ANNNOUNCED = 14

	return {
	oninit: () => {
		//console.log('Admin init')
		artistPrisNeeded = remoteData.Lineups.allPrioritiesDefaultFestivals(
			remoteData.Dates.upcomingDatedFestivals(LINEUP_ANNOUUNCED)
				.map(f => f.id)
		)
		noFutureDates = remoteData.Series.noFutureDates(DATE_ANNOUNCED)
		unscheduledLineupFestivals = remoteData.Sets.unscheduledLineupFestivals(SCHEDULE_ANNNOUNCED)

		artistMissingDayFestivals = remoteData.Sets.artistMissingDayFestivals(SCHEDULE_ANNNOUNCED)
		artistMissingStageFestivals = remoteData.Sets.artistMissingStageFestivals(SCHEDULE_ANNNOUNCED)
		missingStageFestivals = remoteData.Places.missingStageFestivals(SCHEDULE_ANNNOUNCED)
		/*

		//console.log(remoteData.Dates.upcomingDatedFestivals(90))
		//console.log(artistPrisNeeded)
		*/
		//console.log(noFutureDates)
	},
	view: () => <div class="main-stage">
	
			<LauncherBanner 
				title="FestivalTime Admin" 
			/>
		<div class="main-stage-content">
			<WidgetContainer>

				<FixedCardWidget header="Create Festivals">
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
				noFutureDates.length ? <FixedCardWidget header="Empty Series">
			{
				noFutureDates
					.map(series => <SeriesCard eventId={series.id} />)
			}
			</FixedCardWidget> : '' }
		

			{
				artistPrisNeeded.length ? <FixedCardWidget header="Artist Priorities Unassigned">
				{
					artistPrisNeeded
						.map(data => <FestivalCard
							eventId={data.id}
							//route={''}
						/>)
				}
			</FixedCardWidget> : '' }


			{
				missingStageFestivals.length ? <FixedCardWidget header="No stages">
			{
				missingStageFestivals
					.map(data => <FestivalCard
						eventId={data.id}
						//route={}
					/>)
			}
			</FixedCardWidget> : '' }

			{
				artistMissingDayFestivals.length ? <FixedCardWidget header="Artists Need Days">
			{
				artistMissingDayFestivals
					.map(data => <FestivalCard
						eventId={data.id}
						//route={}
					/>)
			}
			</FixedCardWidget> : '' }

			{
				artistMissingStageFestivals.length ? <FixedCardWidget header="Artists Need Stages">
			{
				artistMissingStageFestivals
					.map(data => <FestivalCard
						eventId={data.id}
						//route={}
					/>)
			}
			</FixedCardWidget> : '' }

			{
				unscheduledLineupFestivals.length ? <FixedCardWidget header="Unscheduled Lineup">
			{
				unscheduledLineupFestivals
					.map(data => <FestivalCard
						eventId={data.id}
						//route={}
					/>)
			}
			</FixedCardWidget> : '' }

			</WidgetContainer>
		</div>
	</div>
}}
export default Admin;
