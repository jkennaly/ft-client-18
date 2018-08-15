// App.jsx

const m = require('mithril');

import MainStage from './MainStage.jsx';
import NavBar from './NavBar.jsx';
import DisplayBar from './DisplayBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConferenceCard from '../../components/cards/ConferenceCard.jsx';
import CFPCard from '../../components/cards/CFPCard.jsx';
import ConferenceView from '../../components/cardViews/ConferenceView.jsx';
import CFPView from '../../components/cardViews/CFPView.jsx';
import EntryForm from '../../components/EntryForm.jsx';
import UIButton from '../../components/ui/UIButton.jsx';

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
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/manage/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/manage/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/users/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/users/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/artists/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/artists/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/social/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/social/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/fests/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/fests/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/dates/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/dates/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/series/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/series/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/shows/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/shows/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/stages/pregame": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/stages/gametime": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES, auth)}) :
						m.route.set("/auth")
			},
			"/entry": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => FormView()}) :
						m.route.set("/auth")
			}
		});
	},
	view: ({ children }) =>
		<div class="App">
			<MainStage>
				{children}
			</MainStage>
			{auth.isAuthenticated() ? <DisplayBar /> : ''}
		</div>
};

export default App;