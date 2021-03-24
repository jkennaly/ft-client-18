// src/components/ui/DisplayButton.jsx

import m from 'mithril'
import _ from 'lodash'

import CollapsibleMenu from './CollapsibleMenu.jsx';
import FortyButton from '../fields/buttons/FortyButton.jsx'
import Icon from '../fields/Icon.jsx'

// Services
const validUserItem = {
			name: 'Logout',
			path: '/confirm/logout',
			icon: <FortyButton><Icon name="exit" /></FortyButton>
		}
	const invalidUserItem = {
			name: 'Login',
			path: '/auth',
			params: () => {return{prev: m.route.get()}},
			icon: <FortyButton><Icon name="enter" /></FortyButton>
		
		}
const menuList = (userRoles) => {
	return [
		(userRoles.includes('user') ? {
			name: 'Account',
			path: '/users/account',
			icon: <FortyButton><Icon name="user" /></FortyButton>
		} : ''),
		(userRoles.includes('admin') ? {
			name: 'Admin',
			path: '/admin',
			icon: <FortyButton><Icon name="hammer" /></FortyButton>
		} : ''),
		{
			name: 'Launcher',
			path: '/launcher',
			icon: <FortyButton><img src="/favicon.ico" /></FortyButton>
		},
		{
			name: 'Festivals',
			path: '/series/pregame',
			icon: <FortyButton><Icon name="music" /></FortyButton>
		},
		(userRoles.includes('user') ? {
			name: 'Research',
			path: '/research',
			icon: <FortyButton><Icon name="science" /></FortyButton>
		} : ''),
		(userRoles.includes('user') ? {
			name: 'Theme',
			path: '/themer/schedule',
			icon: <FortyButton><Icon name="paint-format" /></FortyButton>
		} : ''),
	].filter(x => x)
	
} 
const DisplayButton = vnode => {
	var menuHidden = true
	const hideMenu = dom => (e) => {
		//console.log('DisplayButton dom e', dom.contains(e.target))
		if(!dom.contains(e.target)) menuHidden = true
			m.redraw()

	}
	return {
		oncreate: ({attrs, dom}) => {
			document.body.addEventListener('click', hideMenu(dom))
		},
		onremove: ({attrs, dom}) => {
			document.body.removeEventListener('click', hideMenu(dom))
		},
		view: ({ attrs }) => <div>
			<div class="ft-nav-button ft-nav-menu-button" onclick={() => menuHidden = !menuHidden}>
				{attrs.icon}
			</div>
			<CollapsibleMenu 
				menu={menuList(attrs.userRoles).concat([attrs.userRoles.includes('user') ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>
		</div>
	};

}

export default DisplayButton;