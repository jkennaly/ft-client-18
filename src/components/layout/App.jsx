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

import ModalBox from '../modals/ModalBox.jsx';
// Components
import LauncherBanner from '../../components/ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConfirmLogout from '../../components/layout/ConfirmLogout.jsx';
import UIButton from '../../components/ui/UIButton.jsx';

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


const WelcomeView = ({attrs}) => [
	<h1 class="app-title">Client-44</h1>,
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
	auth.getC44UserId(),
	auth.getRoles()
	]).then(([u, r]) => [_.isNumber(u) ? u : 0, _.isArray(r) ? r : []]) : [0, []]



var titleCache = {}
const title = (attrs) => {
	const key = m.route.get()
	const cached = _.get(titleCache, key)
	if(cached) return cached
	if(attrs.titleGet()) return attrs.titleGet()
	return `Client-44`
}
const bannerTitle = (title, route = m.route.get()) => {
	//console.log('bannerTitle', title, titleCache)
	if(_.isString(title)) _.set(titleCache, route, title)
	return _.get(titleCache, route, `Client-44`)

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
	.catch(err => [0, []])
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
		const mainStage = vnode.dom.querySelector("#c44-main-stage");
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
			"/launcher": {
			 	onmatch: authorize(Launcher, Launcher)
			}
		})
		//m.mount(document.getElementById("DisplayBar"), {view: function () {return m(LauncherBanner, _.assign({}, lastUser, {}))}})
	},
	view: ({ children }) =>
		<div class="App">
			{/gametime/.test(m.route.get()) ? '' : <LauncherBanner 
				userId={lastUser[0]}
				userRoles={lastUser[1]}
				titleGet={bannerTitle}
			/>}
			<div id="c44-main-stage">
				{children}
			</div>
			<div id="upgrade-notice" class="hidden">upgrade</div>
		</div>
};

export default App;