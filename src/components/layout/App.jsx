// App.jsx

const m = require('mithril');

import MainStage from './MainStage.jsx';
import NavBar from './NavBar.jsx';
import DisplayBar from './DisplayBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesView from '../../components/cardViews/SeriesView.jsx';
import SetView from '../../components/cardViews/SetView.jsx';
import DateView from '../../components/cardViews/DateView.jsx';
import DayView from '../../components/cardViews/DayView.jsx';
import FestivalView from '../../components/cardViews/FestivalView.jsx';
import ArtistView from '../../components/cardViews/ArtistView.jsx';
import EntryForm from '../../components/EntryForm.jsx';
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

// Mock data
import {getMockData} from '../../store/data';


// Local state
import {getAppPerspective} from '../../store/ui';
import {getAppContext} from '../../store/ui';


const CONFERENCES = getMockData();



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

const FormView = () => [
	<StageBanner action={() => auth.logout()} title="Add Conference" />,
	<CardContainer>
		<EntryForm />
	</CardContainer>
];

const forceLoginRoute = err => {
	console.log(err)
	m.route.set("/auth")

}

const App = {
	oncreate: (vnode) => {
		const mainStage = vnode.dom.querySelector(".main-stage");

        var hashStr = window.location.hash;
        hashStr = hashStr.replace(/^#?\/?/, '');
        localStorage.setItem('raw_token', hashStr);
		auth.handleAuthentication();

		m.route(mainStage, "/auth", {
			"/auth": {
				view: () => WelcomeView()
			},
			"/conferences": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => m.route.set("/" + getAppPerspective() + "/" + getAppContext()))
						.catch(forceLoginRoute)

			},
			"/cfp": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/entry": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => {view: () => FormView()})
						.catch(forceLoginRoute)
			},
			"/manage/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/manage/gametime": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/social/pregame": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => FestivalView(auth))
						.catch(forceLoginRoute)
			},
			"/social/gametime": {
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
			"/users/gametime": {
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
			"/artists/gametime": {
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
			"/fests/gametime": {
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
			"/dates/gametime": {
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
			"/series/gametime": {
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
			"/sets/gametime": {
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
			"/stages/gametime": {
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
			"/users/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			},
			"/users/gametime/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			},
			"/artists/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => ArtistDetail(auth))
						.catch(forceLoginRoute)
			},
			"/artists/gametime/:id": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => ArtistDetail(auth))
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
			"/fests/gametime/:id": {
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
			"/dates/gametime/:id": {
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
			"/days/gametime/:id": {
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
			"/series/gametime/:id": {
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
			"/sets/gametime/:id": {
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
			},
			"/stages/gametime/:id": {
				onmatch: () =>
					auth.getAccessToken()						
					.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			}
		});
		m.mount(document.getElementById("DisplayBar"), DisplayBar)
	},
	view: ({ children }) =>
		<div class="App">
			<MainStage>
				{children}
			</MainStage>
			<div id="DisplayBar" />
		</div>
};

export default App;