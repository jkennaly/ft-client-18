// App.jsx

import m from 'mithril';

import MainStage from './MainStage.jsx';
import DisplayBar from './DisplayBar.jsx';
import Launcher from './Launcher.jsx';

import Research from './Research.jsx';
import Messages from './Messages.jsx';
import Admin from './Admin.jsx';
import Discussion from './Discussion.jsx';
import Gametime from '../../components/gametime/Gametime.jsx';
// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConfirmLogout from '../../components/layout/ConfirmLogout.jsx';
import SeriesView from '../../components/cardViews/SeriesView.jsx';
import SetView from '../../components/cardViews/SetView.jsx';
import DateView from '../../components/cardViews/DateView.jsx';
import DayView from '../../components/cardViews/DayView.jsx';
import FestivalView from '../../components/cardViews/FestivalView.jsx';
import ArtistView from '../../components/cardViews/ArtistView.jsx';
import UIButton from '../../components/ui/UIButton.jsx';

import SeriesDetail from '../../components/detailViewsPregame/SeriesDetail.jsx';
import FestivalDetail from '../../components/detailViewsPregame/FestivalDetail.jsx';
import DateDetail from '../../components/detailViewsPregame/DateDetail.jsx';
import DayDetail from '../../components/detailViewsPregame/DayDetail.jsx';
import SetDetail from '../../components/detailViewsPregame/SetDetail.jsx';
import ArtistDetail from '../../components/detailViewsPregame/ArtistDetail.jsx';

import CreateSeries from '../../components/createFestivals/series/createSeries.jsx';
import CreateFestival from '../../components/createFestivals/festivals/createFestival.jsx';
import CreateDate from '../../components/createFestivals/dates/createDate.jsx';
import CreateVenue from '../../components/createFestivals/venues/createVenue.jsx';
import AssignDays from '../../components/createFestivals/sets/AssignDays.jsx';
import AssignSetStages from '../../components/createFestivals/sets/AssignStages.jsx';
import AssignTimes from '../../components/createFestivals/sets/AssignTimes.jsx';
import SetStages from '../../components/createFestivals/festivals/SetStages.jsx';
import SetLineup from '../../components/createFestivals/lineups/SetLineup.jsx';
import FixArtist from '../../components/createFestivals/lineups/FixArtist.jsx';

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

const WelcomeView = () => [
	<h1 class="app-title">Festival Time</h1>,
	<h2 class="app-greeting">Welcome</h2>,
	<span class="app-description">Choose your own stage</span>,
	<div class="login-button">
		<UIButton action={() => auth.login()} buttonName="LOGIN" />
	</div>
];

const forceLoginRoute = err => {
	console.error(err)
	m.route.set("/confirm/logout")

}

const App = {
	oninit: vnode => {
	//console.log('app running oninint')
	},
	onbeforeupdate: vnode => {


	},
	oncreate: (vnode) => {
		const mainStage = vnode.dom.querySelector("#main-stage");
/*
        var hashStr = window.location.hash;
        hashStr = hashStr.replace(/^#?\/?/, '');
        localStorage.setItem('raw_token', hashStr);
*/
//console.log('app running 1')
//console.log('app running 2')
		

		m.route(mainStage, "/launcher", {
			"/auth": {
				onmatch: () => {
					auth.logout(true)
				},
				render: WelcomeView
			},
			"/confirm/logout": {
				onmatch: ConfirmLogout
			},
			"/launcher": {
				onmatch: Launcher

			},
			"/research": {
				onmatch: Research

			},
			"/messages": {
				onmatch: Messages

			},
			"/gametime/locations/:subjectType/:subject": {
				onmatch: Gametime

			},
			"/gametime/:subjectType/:subject": {
				onmatch: Gametime

			},
			"/admin": {
				onmatch: Admin

			},
			"/discussion/:messageId": {
				onmatch: () =>
					auth.getAccessToken()
						.then(Discussion)
						.catch(forceLoginRoute)

			},
			"/manage/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(Launcher)
						.catch(forceLoginRoute)
			},
			"/social/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/users/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/artists/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => ArtistView(auth))
						.catch(forceLoginRoute)
			},
			"/fests/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/dates/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => DateView(auth))
						.catch(forceLoginRoute)
			},
			"/series/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SeriesView(auth))
						.catch(forceLoginRoute)
			},
			"/sets/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SetView(auth))
						.catch(forceLoginRoute)
			},
			"/stages/pregame": {
				onmatch: () =>
					auth.getAccessToken()						
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/venues/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateVenue(auth))
						.catch(forceLoginRoute)
			},
			"/sets/pregame/assignDays": {
				onmatch: () =>
					auth.getAccessToken()
						.then(AssignDays)
						.catch(forceLoginRoute)
			},
			"/sets/pregame/assignTimes": {
				onmatch: () =>
					auth.getAccessToken()
						.then(AssignTimes)
						.catch(forceLoginRoute)
			},
			"/sets/pregame/assignStages": {
				onmatch: () =>
					auth.getAccessToken()
						.then(AssignSetStages)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/assignStages": {
				onmatch: () =>
					auth.getAccessToken()
						.then(SetStages)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/assignLineup": {
				onmatch: () =>
					auth.getAccessToken()
						.then(SetLineup)
						.catch(forceLoginRoute)
			},
			"/artists/pregame/fix": {
				onmatch: () =>
					auth.getAccessToken()
						.then(FixArtist)
						.catch(forceLoginRoute)
			},
			"/artists/pregame/fix/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(FixArtist)
						.catch(forceLoginRoute)
			},
			"/users/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			},
			"/artists/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(ArtistDetail)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/new/:seriesId": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateFestival(auth))
						.catch(forceLoginRoute)
			},
			"/fests/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateFestival(auth))
						.catch(forceLoginRoute)
			},
			"/fests/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalDetail(auth))
						.catch(forceLoginRoute)
			},
			"/dates/pregame/new/:festivalId": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateDate(auth))
						.catch(forceLoginRoute)
			},
			"/dates/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateDate(auth))
						.catch(forceLoginRoute)
			},
			"/dates/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => DateDetail(auth))
						.catch(forceLoginRoute)
			},
			"/days/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => DayDetail(auth))
						.catch(forceLoginRoute)
			},
			"/series/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateSeries(auth))
						.catch(forceLoginRoute)
			},
			"/series/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			},
			"/sets/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SetDetail(auth))
						.catch(forceLoginRoute)
			},
			"/stages/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()						
					.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			}
		});
		
		//m.mount(document.getElementById("DisplayBar"), DisplayBar)
	},
	view: ({ children }) =>
		<div class="App">
			<div id="main-stage">
				{children}
			</div>
			<div id="DisplayBar" />
			<div id="upgrade-notice" class="hidden">upgrade</div>
		</div>
};

export default App;