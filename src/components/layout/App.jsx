// src/components/layout/App.jsx

import m from 'mithril'
import _ from 'lodash'

/*
import { dom, config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
config.autoReplaceSvg = true
config.observeMutations = true
library.add(fas)
*/

import { remoteData } from "../../store/data";

import MainStage from './MainStage.jsx';
import DisplayBar from './DisplayBar.jsx';
import Launcher from './Launcher.jsx';
import ScheduleThemer from './ScheduleThemer.jsx';
import Account from './Account.jsx';

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
import UserView from '../../components/cardViews/UserView.jsx';
import UIButton from '../../components/ui/UIButton.jsx';

import SeriesDetail from '../../components/detailViewsPregame/SeriesDetail.jsx';
import FestivalDetail from '../../components/detailViewsPregame/FestivalDetail.jsx';
import DateDetail from '../../components/detailViewsPregame/DateDetail.jsx';
import DayDetail from '../../components/detailViewsPregame/DayDetail.jsx';
import SetDetail from '../../components/detailViewsPregame/SetDetail.jsx';
import ArtistDetail from '../../components/detailViewsPregame/ArtistDetail.jsx';
import UserDetail from '../../components/detailViewsPregame/UserDetail.js';

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
const auth = Auth;


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
var eventCache = {}
var focusCache = {}
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
const eventBadge = (selection) => {
	const key = m.route.get()
	if(!_.isString(selection)) return _.get(eventCache, key)
	const badge = selection === `hasAccess` ? {src: `img/has-access.svg`} :
		selection === '' ? undefined :
		{src: `img/live-access.svg`, buyModal: true}
	//console.log('eventBadge', selection, badge)
	_.set(eventCache, key, badge)
	return _.get(eventCache, key)


}
const focusSubject = (so) => {
	
	if(_.isUndefined(so)) return focusCache
	//console.log('focusSubject', so)
	focusCache = so
	return so


}
//console.log(`app here`)
var lastUser = [0, []]
var lastAttrs = {}
const popModal = (...popRequestArgs) => {
	if(!lastUser[1].includes('user')) return auth.login(m.route.get())
	return ModalBox.popRequest(...popRequestArgs)
}
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
		}), undefined, true)
		return acb
	})
	.catch(err => [0, []])
	.then(user => Promise.all([lastUser = user, user[0] && auth.getGttDecoded()]))
	.then(([userDataRaw, gtt]) => {
		//console.log(`route resolved`, rParams)
		return {
		oninit: () => {
			//console.log(`component init`, userDataRaw, resolveComponent)
			if(resolveComponent.preload) return resolveComponent.preload(rParams)
				/*
				.catch(err => {
					console.error('init fail', rParams)
			
				})
				*/
		},
		view: ({attrs}) => {
			//console.log(`component resolving`, attrs.filter, resolveComponent)
			const attrIds = _.reduce(attrs, (passing, v, k) => {
				if(passing[k]) return passing
				const kOk = /^id$/.test(k) || /Id$/.test(k) || /^subject/.test(k)
				const useV = kOk && (_.isInteger(v) || /^\d+$/.test(v))
				passing[k] = _.isInteger(v) ? v : _.toInteger(v)
				return passing
			} , {})
			const baseAttrs = {
				titleSet: bannerTitle, 
				eventSet: eventBadge, 
				focusSubject: focusSubject,
				userId: userDataRaw[0], 
				userRoles: userDataRaw[1],
				gtt: gtt ? gtt : {},
				auth: auth,
				popModal: popModal,
				filter: attrs.filter
			}
			const mainAttrs = Object.assign({}, attrIds, baseAttrs)
			lastAttrs = attrIds
			return [m(ModalBox), m(resolveComponent, mainAttrs)]
		}
	}})
	.catch(err => {
		console.error(err)
		bannerTitle('')
		eventBadge('')
		return rejectComponent ? rejectComponent : Launcher
	})


const App = {
	name: 'App',
	oncreate: (vnode) => {
		const mainStage = vnode.dom.querySelector("#main-stage");
		//font awesome watching for icons to rpelace
		//dom.watch({autoReplaceSvgRoot: vnode.dom, observeMutationsRoot:vnode.dom})
/*
        var hashStr = window.location.hash;
        hashStr = hashStr.replace(/^#?\/?/, '');
        localStorage.setItem('raw_token', hashStr);
*/
//console.log('app running 1')
//console.log('app running 2')
		
		m.route(mainStage, "/launcher", {
			"/admin": {
				onmatch: authorize(Admin, Launcher)
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
			"/artists/pregame/:id": {
			 	onmatch: (routing) => {

					//remoteData.Artists.subjectDetails({subject: routing.id, subjectType: ARTIST})

					return authorize(ArtistDetail, ArtistDetail) (routing)
				}
				 
			},
			"/auth": {
				render: WelcomeView
			},
			"/auth/:prev": {
				render: WelcomeView
			},
			"/callback": {
				onmatch: () => {
					const query = window.location.href.substring(window.location.href.indexOf('?'))
        			const handling = /code/.test(query) && /state/.test(query) || /token/.test(query)
        			//console.log('callback query', query, window.location.href)
        			if(!handling) return m.route.set('/launcher')
        			localStorage.clear()
        			return auth.handleAuthentication()
        		/*
        		.then(x => {
        			console.log('auth callback', x)
        			return x
        		})
				*/						
						.then(acb => auth.isAuthenticated()		
							.then(rawUserData)
							.catch(err => [0, []] )
							.then(user => lastUser = user)
							.then(() => acb)
							//.then(udr => [console.log(`callback new raw promise udr/acb`, udr), udr][1])
						)
						//.then(r => console.log(`callback new raw promise acb`, r) || r)
						.then(acb => acb && acb.appState && acb.appState.route ? acb.appState.route : '/launcher')
        				.then(route => m.route.set(route))
        				.catch(console.error)
        				//.then(() => m.redraw())
				}
			},
			"/confirm/logout": {
				onmatch: ConfirmLogout
			},
			"/dates/pregame/new": {
				onmatch: authorize(CreateDate, Launcher)
			},
			"/dates/pregame/new/:festivalId": {
				onmatch: authorize(CreateDate, Launcher)
			},
			"/dates/pregame/:id": {
				onmatch: authorize(DateDetail, DateDetail)
			},
			"/days/pregame/:id": {
				onmatch: authorize(DayDetail, DayDetail)
			},
			"/discussion/:messageId": {
				onmatch: () =>
					auth.getAccessToken()
						.then(Discussion)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/assignLineup": {
				onmatch: authorize(SetLineup, Launcher)
			},
			"/fests/pregame/assignStages": {
				onmatch: () =>
					auth.getAccessToken()
						.then(SetStages)
						.catch(forceLoginRoute)
			},
			"/fests/pregame/:id": {
				onmatch: authorize(FestivalDetail, FestivalDetail)
			},
			"/fests/pregame/new": {
				onmatch:(routing) => {

					

					return authorize(CreateFestival, Launcher) (routing)
				}
			},
			"/fests/pregame/new/:seriesId": {
				onmatch:(routing) => {

					remoteData.Festivals.remoteCheck(true)
					remoteData.Series.remoteCheck(true)

					return authorize(CreateFestival, Launcher) (routing)
				}
			},
			"/gametime/locations/:subjectType/:subject": {
				onmatch: authorize(Gametime, Launcher)

			},
			"/gametime/:subjectType/:subject": {
				onmatch: authorize(Gametime, Launcher)

			},
			"/launcher": {
			 	onmatch: authorize(Launcher, Launcher)
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
			"/messages": {
				onmatch: authorize(Messages, Launcher)
			},
			"/messages/:filter": {
				onmatch: authorize(Messages, Launcher)
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
			"/series/pregame": {
				onmatch: (routing) => {

					remoteData.Series.remoteCheck()

					return authorize(SeriesView, SeriesView) (routing)
				}
			},
			"/series/pregame/new": {
				onmatch: authorize(CreateSeries, Launcher)
			},
			"/series/pregame/:id": {
				onmatch: authorize(SeriesDetail, SeriesDetail)
			},
			"/sets/pregame/assignDays": {
				onmatch: authorize(AssignDays, Launcher)
			},
			"/sets/pregame/assignStages": {
				onmatch: authorize(AssignSetStages, Launcher)
			},
			"/sets/pregame/assignTimes": {
				onmatch: authorize(AssignTimes, Launcher)
			},
			"/sets/pregame/:id": {
				onmatch: SetDetail
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
			"/stages/pregame/:id": {
				onmatch: () =>
					auth.getAccessToken()						
					.then(() => SeriesDetail(auth))
						.catch(forceLoginRoute)
			},
			"/themer/schedule": {
				onmatch: authorize(ScheduleThemer, ScheduleThemer)
			},
			"/users/account": {
				onmatch: (routing) => {

					//remoteData.Users.recent(10)

					return authorize(Account, WelcomeView) (routing)
				}
			},
			"/users/pregame": {
				onmatch: (routing) => {

					//remoteData.Users.recent(10)

					return authorize(UserView, UserView) (routing)
				}
			},
			"/users/pregame/:id": {
				onmatch: authorize(UserDetail, UserDetail)
			},
			"/venues/pregame/new": {
				onmatch: () =>
					auth.getAccessToken()
						.then(() => CreateVenue(auth))
						.catch(forceLoginRoute)
			},
		});
	
	
		//m.mount(document.getElementById("DisplayBar"), {view: function () {return m(LauncherBanner, _.assign({}, lastUser, {}))}})
	},
	view: ({ children }) =>
		<div class="App">
			{/gametime/.test(m.route.get()) ? '' : <LauncherBanner 
				userId={lastUser[0]}
				userRoles={lastUser[1]}
				titleGet={bannerTitle}
				eventGet={eventBadge}
				popModal={popModal}
				focusSubject={focusSubject}
			/>}
			<div id="main-stage">
				{children}
			</div>
		</div>
};

export default App;
