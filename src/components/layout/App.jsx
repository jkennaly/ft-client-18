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

const App = {
	oncreate: (vnode) => {
		const mainStage = vnode.dom.querySelector(".main-stage");

		auth.handleAuthentication();

		m.route(mainStage, "/auth", {
			"/auth": {
				view: () => WelcomeView()
			},
			"/conferences": {
				onmatch: () =>
					auth.isAuthenticated() ?
						m.route.set("/" + getAppPerspective() + "/" + getAppContext()) :
						m.route.set("/auth")

			},
			"/cfp": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/entry": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => FormView()}) :
						m.route.set("/auth")
			},
			"/manage/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/manage/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/social/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/social/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/users/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/users/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/artists/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(ArtistView(auth)) :
						m.route.set("/auth")
			},
			"/artists/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(ArtistView(auth)) :
						m.route.set("/auth")
			},
			"/fests/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/fests/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/dates/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(DateView(auth)) :
						m.route.set("/auth")
			},
			"/dates/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(DateView(auth)) :
						m.route.set("/auth")
			},
			"/series/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SeriesView(auth)) :
						m.route.set("/auth")
			},
			"/series/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SeriesView(auth)) :
						m.route.set("/auth")
			},
			"/sets/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SetView(auth)) :
						m.route.set("/auth")
			},
			"/sets/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SetView(auth)) :
						m.route.set("/auth")
			},
			"/stages/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?						
					(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/stages/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?						
					(FestivalView(auth)) :
						m.route.set("/auth")
			},
			"/users/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SeriesDetail(auth)) :
						m.route.set("/auth")
			},
			"/users/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SeriesDetail(auth)) :
						m.route.set("/auth")
			},
			"/artists/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(ArtistDetail(auth)) :
						m.route.set("/auth")
			},
			"/artists/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(ArtistDetail(auth)) :
						m.route.set("/auth")
			},
			"/fests/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalDetail(auth)) :
						m.route.set("/auth")
			},
			"/fests/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(FestivalDetail(auth)) :
						m.route.set("/auth")
			},
			"/dates/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(DateDetail(auth)) :
						m.route.set("/auth")
			},
			"/dates/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(DateDetail(auth)) :
						m.route.set("/auth")
			},
			"/days/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(DayDetail(auth)) :
						m.route.set("/auth")
			},
			"/days/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(DayDetail(auth)) :
						m.route.set("/auth")
			},
			"/series/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SeriesDetail(auth)) :
						m.route.set("/auth")
			},
			"/series/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SeriesDetail(auth)) :
						m.route.set("/auth")
			},
			"/sets/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SetDetail(auth)) :
						m.route.set("/auth")
			},
			"/sets/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?
						(SetDetail(auth)) :
						m.route.set("/auth")
			},
			"/stages/pregame/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?						
					(SeriesDetail(auth)) :
						m.route.set("/auth")
			},
			"/stages/gametime/:id": {
				onmatch: () =>
					auth.isAuthenticated() ?						
					(SeriesDetail(auth)) :
						m.route.set("/auth")
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