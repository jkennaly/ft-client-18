// src/components/layout/App.jsx

import m from 'mithril'
import _ from 'lodash'

import { dom, config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
config.autoReplaceSvg = true
config.observeMutations = true
library.add(fas)


import { remoteData } from "../../store/data";

import MainStage from './MainStage.jsx';
import DisplayBar from './DisplayBar.jsx';
import Launcher from './Launcher.jsx';
import ScheduleThemer from './ScheduleThemer.jsx';

import Research from './Research.jsx';
import Messages from './Messages.jsx';
import Admin from './Admin.jsx';
import Discussion from './Discussion.jsx';
import ModalBox from '../modals/ModalBox.jsx';
import Gametime from '../../components/gametime/Gametime.jsx';
// Components
import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConfirmLogout from '../../components/layout/ConfirmLogout.jsx';
import SeriesView from '../../components/cardViews/SeriesView.jsx';
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
	<span class="app-description">A Festival App For The Rest Of Us</span>,
	<div class="login-button">
		<UIButton action={() => auth.login(attrs.prev)} buttonName="LOGIN" />
	</div>
];

const forceLoginRoute = err => {
	console.error(err)
	m.route.set("/confirm/logout")

}

const rawUserData = status => status ? Promise.all([
	auth.getFtUserId(),
	auth.getRoles()
	]).then(([u, r]) => [_.isNumber(u) ? u : 0, _.isArray(r) ? r : []]) : [0, []]



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
//console.log(`app here`)
var lastUser = [0, []]
const authorize = (resolveComponent, rejectComponent) => (rParams) => auth.isAuthenticated()		
	.then(rawUserData)
	.then(acb => {
		acb[0] && remoteData.Flags.remoteCheck()
		acb[0] && remoteData.Intentions.remoteCheck()
		acb[0] && remoteData.Interactions.remoteCheck()
		acb[0] && remoteData.MessagesMonitors.remoteCheck()
		acb[0] && remoteData.Messages.acquireListSupplement('filter=' + JSON.stringify({
			where: {
				fromuser: acb[0],
				messageType: CHECKIN
			}
		}))
		return acb
	})
	.catch(err => console.error('no authorize') || [0, []])
	.then(user => lastUser = user)
	.then(userDataRaw => {
		//console.log(`route resolved`, rParams)
		return {
		oninit: () => {
			//console.log(`component init`, userDataRaw, resolveComponent)
			if(resolveComponent.preload) return Promise.all([resolveComponent.preload(rParams)])
				.catch(err => {
					console.error('init fail', rParams)
			
				})
		},
		view: ({attrs}) => {
		//console.log(`component resolving`, userDataRaw, resolveComponent)
			const attrIds = _.reduce(attrs, (passing, v, k) => {
				const kOk = /^id$/.test(k) || /Id$/.test(k) || /^subject/.test(k)
				const useV = kOk && (_.isInteger(v) || /^\d+$/.test(v))
				passing[k] = _.isInteger(v) ? v : _.toInteger(v)
				return passing
			} , {
				titleSet: bannerTitle, 
				userId: userDataRaw[0], 
				userRoles: userDataRaw[1],
				popModal: (...popRequestArgs) => {
					if(!userDataRaw[1].includes('user')) return auth.login(m.route.get())
					return ModalBox.popRequest(...popRequestArgs)
				},
				filter: attrs.filter
			})
			return [m(ModalBox), m(resolveComponent, attrIds)]
		}
	}})
	.catch(err => {
		console.error(err)
		bannerTitle('')
		return rejectComponent ? rejectComponent : Launcher
	})


const App = {
	name: 'App',
	oncreate: (vnode) => {
		const mainStage = vnode.dom.querySelector("#main-stage");
		//font awesome watching for icons to rpelace
		dom.watch({autoReplaceSvgRoot: vnode.dom, observeMutationsRoot:vnode.dom})
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
			 	onmatch: authorize(Launcher, Launcher)
			},
			"/callback": {
				onmatch: () => {
					const query = window.location.search
        			const handling = /code/.test(query) && /state/.test(query)

        			if(!handling) return m.route.set('/launcher')
        			localStorage.clear()
        			return auth.handleAuthentication()
        		/*
        		.then(x => {
        			console.log('auth callback', x)
        			return x
        		})
				*/						
						.then(acb => {
							//console.log(`callback new raw promise`)
							rawUserPromise = auth.isAuthenticated()		
								.then(rawUserData)
								//.then(udr => [console.log(`callback new raw promise`, udr), udr][1])
								.catch(err => [0, []] )
								.then(user => lastUser = user)
							return acb
						})
        				.then(acb => m.route.set(acb && acb.appState && acb.appState.route ? acb.appState.route : '/launcher', ))
        				//.then(() => m.redraw())
				}
			},
			"/:mode/subject/:subjectType/:subject": {
				onmatch: (rParams) => {
					//console.log('pregame subject', rParams)
					const nextParams = _.omit(rParams, ['mode', 'subjectType', 'subject'])
					if(rParams.subjectType === `${ARTIST}`) return m.route
						.set(`/artists/${rParams.mode}/${rParams.subject}`, nextParams)
					if(rParams.subjectType === `${SERIES}`) return m.route
						.set(`/series/${rParams.mode}/${rParams.subject}`, nextParams)
					if(rParams.subjectType === `${FESTIVAL}`) return m.route.
						set(`/fests/${rParams.mode}/${rParams.subject}`, nextParams)
					if(rParams.subjectType === `${DATE}`) return m.route
						.set(`/dates/${rParams.mode}/${rParams.subject}`, nextParams)
					if(rParams.subjectType === `${DAY}` && rParams.mode === `pregame`) return m.route
						.set(`/days/${rParams.mode}/${rParams.subject}`, nextParams)
					if(rParams.subjectType === `${DAY}` && rParams.mode === `gametime`) return m.route
						.set(`/gametime/${subjectType}/${subject}`, nextParams)
					if(rParams.subjectType === `${SET}` && rParams.mode === `pregame`) return m.route
						.set(`/artists/pregame/${_.get(
							remoteData.Sets.get(_.toInteger(rParams.subject)), 'band'
						)}`, nextParams)
					if(rParams.subjectType === `${SET}` && rParams.mode === `gametime`) return m.route
						.set(`/gametime/${subjectType}/${subject}`, nextParams)
				}
			},
			"/research": {
				onmatch: authorize(Research, Launcher)

			},
			"/research/:seriesId": {
				onmatch: authorize(Research, Launcher)

			},
			"/research/:seriesId/:festivalId": {
				onmatch: authorize(Research, Launcher)

			},
			"/messages": {
				onmatch: authorize(Messages, Launcher)
			},
			"/messages/:filter": {
				onmatch: authorize(Messages, Launcher)
			},
			"/gametime/locations/:subjectType/:subject": {
				onmatch: authorize(Gametime, Launcher)

			},
			"/gametime/:subjectType/:subject": {
				onmatch: authorize(Gametime, Launcher)

			},
			"/admin": {
				onmatch: authorize(Admin, Launcher)
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
			"/series/pregame": {
				onmatch: (routing) => {

					remoteData.Series.remoteCheck()

					return authorize(SeriesView, SeriesView) (routing)
				}
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
				onmatch: authorize(AssignDays, Launcher)
			},
			"/sets/pregame/assignTimes": {
				onmatch: authorize(AssignTimes, Launcher)
			},
			"/sets/pregame/assignStages": {
				onmatch: authorize(AssignSetStages, Launcher)
			},
			"/fests/pregame/assignStages": {
				onmatch: () =>
					auth.getAccessToken()
						.then(SetStages)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/assignLineup": {
				onmatch: authorize(SetLineup, Launcher)
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

					//remoteData.Artists.subjectDetails({subject: routing.id, subjectType: ARTIST})

					return authorize(ArtistDetail, ArtistDetail) (routing)
				}
				 
			},
			"/fests/pregame/new/:seriesId": {
				onmatch:(routing) => {

					remoteData.Festivals.remoteCheck(true)
					remoteData.Series.remoteCheck(true)

					return authorize(CreateFestival, Launcher) (routing)
				}
			},
			"/fests/pregame/new": {
				onmatch:(routing) => {

					

					return authorize(CreateFestival, Launcher) (routing)
				}
			},
			"/fests/pregame/:id": {
				onmatch: authorize(FestivalDetail, FestivalDetail)
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
				onmatch: authorize(DateDetail, DateDetail)
			},
			"/days/pregame/:id": {
				onmatch: authorize(DayDetail, DayDetail)
			},
			"/series/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateSeries(auth))
						.catch(forceLoginRoute)
			},
			"/series/pregame/:id": {
				onmatch: authorize(SeriesDetail, SeriesDetail)
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
				onmatch: authorize(ScheduleThemer, ScheduleThemer)
			}
		});
		
		//m.mount(document.getElementById("DisplayBar"), {view: function () {return m(LauncherBanner, _.assign({}, lastUser, {}))}})
	},
	view: ({ children }) =>
		<div class="App">
			{/gametime/.test(m.route.get()) ? '' : <LauncherBanner 
				userId={lastUser[0]}
				userRoles={lastUser[1]}
				titleGet={bannerTitle}
			/>}
			<div id="main-stage">
				{children}
			</div>
			<div id="upgrade-notice" class="hidden">upgrade</div>
		</div>
};

export default App;
