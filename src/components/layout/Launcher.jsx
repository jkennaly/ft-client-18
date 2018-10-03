// Launcher.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


const m = require("mithril");
const _ = require("lodash");

import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';

import {remoteData} from '../../store/data';

const Launcher = (vnode) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Venues.loadList()
		remoteData.Days.loadList()
	},
	view: () => 
	<div class="launcher-container">
		<div class="stage-banner-container">
			<LauncherBanner 
				action={() => auth.logout()}
				title="FestivalTime Launcher" 
			/>
		</div>
		<div>
			<WidgetContainer>
				<FixedCardWidget header="All Festivals">
				{
					remoteData.Series.list
						.map(series => <SeriesCard data={series} eventId={series.id}/>)
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
				<FixedCardWidget header="Create Festivals">
					<SeriesCard eventId="new"/>
					<FestivalCard eventId="new"/>
					<DateCard eventId="new"/>
					<NavCard fieldValue="Fix Artist Names" action={() => m.route.set("/artists/pregame/fix")}/>
					<NavCard fieldValue="Assign Artists to Festival" action={() => m.route.set("/fests/pregame/assignLineup")}/>
					<NavCard fieldValue="Assign Stages to Festival" action={() => m.route.set("/fests/pregame/assignStages")}/>
					<NavCard fieldValue="Assign Artists to Days" action={() => m.route.set("/sets/pregame/assignDays")}/>
					<NavCard fieldValue="Assign Artists to Stages" action={() => m.route.set("/sets/pregame/assignStages")}/>
					<NavCard fieldValue="Enter Set Times" action={() => m.route.set("/sets/pregame/assignTimes")}/>
				</FixedCardWidget>
			</WidgetContainer>
		</div>
	</div>
}}
export default Launcher;
