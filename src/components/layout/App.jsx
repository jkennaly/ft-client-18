// App.jsx

import m from 'mithril'
import _ from 'lodash'
import { remoteData } from "../../store/data";

import MainStage from './MainStage.jsx';
import DisplayBar from './DisplayBar.jsx';
import Launcher from './Launcher.jsx';
import ScheduleThemer from './ScheduleThemer.jsx';

import Research from './Research.jsx';
import Messages from './Messages.jsx';
import Admin from './Admin.jsx';
import Discussion from './Discussion.jsx';
import Gametime from '../../components/gametime/Gametime.jsx';
// Components
import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
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

const WelcomeView = ({attrs}) => [
	<h1 class="app-title">FestiGram</h1>,
	<h2 class="app-greeting">Welcome</h2>,
	<span class="app-description">Like Instacart, but for music festivals*</span>,
	<div class="login-button">
		<UIButton action={() => auth.login(attrs.prev)} buttonName="LOGIN" />
	</div>,
	<span>*: Not anything like Instacart. Please don't sue me.</span>
];

const forceLoginRoute = err => {
	console.error(err)
	m.route.set("/confirm/logout")

}

const rawUserData = status => status ? Promise.all([
	auth.getFtUserId(),
	auth.getRoles()
	]) : [0, []]

var titleCache = {}
const title = (attrs) => {
	const key = m.route.get()
	const cached = _.get(titleCache, key)
	if(cached) return cached
	if(attrs.titleGet()) return attrs.titleGet()
	return `FestiGram`
}
const bannerTitle = (title, route = m.route.get()) => {
	//console.log('bannerTitle', title, titleCache)
	if(_.isString(title)) _.set(titleCache, route, title)
	return _.get(titleCache, route, `FestiGram`)


}
const authorize = (rawUserPromise, resolveComponent, rejectComponent) => (rParams) => rawUserPromise
	.then(userDataRaw => {
		//console.log(`route resolved`)
		return {
		oninit: () => {
			//console.log(`component init`, userDataRaw, resolveComponent)
			if(resolveComponent.preload) return Promise.all([resolveComponent.preload(rParams)])
				.catch(err => {
					console.error('init fail', rParams)
					return m(Launcher)
				})
		},
		view: () => {
		//console.log(`component resolving`, userDataRaw, resolveComponent)
			return m(resolveComponent, {titleSet: bannerTitle, userId: userDataRaw[0], userRoles: userDataRaw[1]})
		}
	}})
	.catch(err => {
		console.error(err)
		bannerTitle('')
		return rejectComponent ? rejectComponent : Launcher
	})
var lastUser = [0, []]

var rawUserPromise = auth.isAuthenticated()		
	.then(rawUserData)
	.catch(err => [0, []])
	.then(user => lastUser = user)
const App = {
	name: 'App',
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
				render: WelcomeView
			},
			"/auth/:prev": {
				render: WelcomeView
			},
			"/confirm/logout": {
				onmatch: ConfirmLogout
			},
			"/launcher": {
			 	onmatch: authorize(rawUserPromise, Launcher, Launcher)
			},
			"/callback": {
				onmatch: () => {
					const query = window.location.search
        			const handling = /code/.test(query) && /state/.test(query)

        			if(!handling) return m.route.set('/launcher')
        			return auth.handleAuthentication()
        		/*
        		.then(x => {
        			console.log('auth callback', x)
        			return x
        		})
*/						
						.then(acb => {
							console.log(`callback new raw promise`)
							rawUserPromise = auth.isAuthenticated()		
								.then(rawUserData)
								.catch(err => [0, []])
								.then(user => lastUser = user)
							return acb
						})
        				.then(acb => m.route.set(acb && acb.appState && acb.appState.route ? acb.appState.route : '/launcher', ))
        				//.then(() => m.redraw())

				}

			},
			"/research": {
				onmatch: authorize(rawUserPromise, Research, Launcher)

			},
			"/research/:seriesId": {
				onmatch: authorize(rawUserPromise, Research, Launcher)

			},
			"/research/:seriesId/:festivalId": {
				onmatch: authorize(rawUserPromise, Research, Launcher)

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
				onmatch: authorize(rawUserPromise, Admin, Launcher)

			},
			"/discussion/:messageId": {
				onmatch: () =>
					auth.getAccessToken()
						.then(Discussion)
						.catch(forceLoginRoute)

			},
			"/manage/pregame": {
				onmatch: () => auth.getAccessToken()		
					.then(() => Promise.all([
						auth.getFtUserId(),
						auth.getRoles()
					]))
					.then(userDataRaw => <Launcher userId={userDataRaw[0]} userRoles={userDataRaw[1]} />)
					//.then(userDataRaw => m(Launcher, {userId: userDataRaw[0], userRoles: userDataRaw[1]}))
					.catch(err => {
						if(err.error === 'login_required') return <Launcher userId={0} userRoles={[]} />
						console.error(err)
					})
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
				onmatch: ArtistView
			},
			"/fests/pregame": {
				onmatch: FestivalView
			},
			"/dates/pregame": {
				onmatch: authorize(rawUserPromise, DateView, DateView) 
			},
			"/series/pregame": {
				onmatch: (routing) => {

					remoteData.Series.remoteCheck()

					return authorize(rawUserPromise, SeriesView, SeriesView) (routing)
				}
			},
			"/sets/pregame": {
				onmatch: SetView
			},
			"/stages/pregame": {
				onmatch: () => auth.isAuthenticated()		
					.then(rawUserData)
					.then(userDataRaw => {return {
						view: () => {
							return m(FestivalView, {userId: userDataRaw[0], userRoles: userDataRaw[1]})
						}
					}})
					.catch(err => {
						console.error(err)
						return m(FestivalView)
					})
			},
			"/venues/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateVenue(auth))
						.catch(forceLoginRoute)
			},
			"/sets/pregame/assignDays": {
				onmatch: authorize(rawUserPromise, AssignDays, Launcher)
			},
			"/sets/pregame/assignTimes": {
				onmatch: authorize(rawUserPromise, AssignTimes, Launcher)
			},
			"/sets/pregame/assignStages": {
				onmatch: authorize(rawUserPromise, AssignSetStages, Launcher)
			},
			"/fests/pregame/assignStages": {
				onmatch: () =>
					auth.getAccessToken()
						.then(SetStages)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/assignLineup": {
				onmatch: authorize(rawUserPromise, SetLineup, Launcher)
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
				onmatch: SeriesDetail
			},
			"/artists/pregame/:id": {
			 	onmatch: (routing) => {

					remoteData.Artists.subjectDetails({subject: routing.id, subjectType: ARTIST})

					return authorize(rawUserPromise, ArtistDetail, ArtistDetail) (routing)
				}
				 
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
				onmatch:(routing) => {

					remoteData.Festivals.subjectDetails({subject: routing.id, subjectType: FESTIVAL})

					return authorize(rawUserPromise, FestivalDetail, FestivalDetail) (routing)
				}
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
				onmatch: authorize(rawUserPromise, DateDetail, DateDetail)
			},
			"/days/pregame/:id": {
				onmatch: authorize(rawUserPromise, DayDetail, DayDetail)
			},
			"/series/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateSeries(auth))
						.catch(forceLoginRoute)
			},
			"/series/pregame/:id": {
				onmatch: authorize(rawUserPromise, SeriesDetail, SeriesDetail)
			},
			"/sets/pregame/:id": {
				onmatch: SetDetail
			},
			"/stages/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()						
					.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			},
			"/themer/schedule": {
				onmatch: () =>
					auth.getAccessToken()		
					.then(() => Promise.all([
						auth.getFtUserId(),
						auth.getRoles()
					]))
					.catch(err => {
						console.error(err)
						return [0, []]
					})
					.then(userDataRaw => m(ScheduleThemer, {userId: userDataRaw[0], userRoles: userDataRaw[1]}))
					.catch(console.error)
			}
		});
		
		//m.mount(document.getElementById("DisplayBar"), {view: function () {return m(LauncherBanner, _.assign({}, lastUser, {}))}})
	},
	view: ({ children }) =>
		<div class="App">
			<LauncherBanner 
				userId={lastUser[0]}
				userRoles={lastUser[1]}
				titleGet={bannerTitle}
			/>
			<div id="main-stage">
				{children}
			</div>
			<div id="upgrade-notice" class="hidden">upgrade</div>
		</div>
};

export default App;