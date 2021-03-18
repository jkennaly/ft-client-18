// src/components/ui/DisplayButton.jsx

import m from 'mithril'
import _ from 'lodash'

import CollapsibleMenu from './CollapsibleMenu.jsx';
import FortyButton from '../fields/buttons/FortyButton.jsx'

// Services
const validUserItem = {
			name: 'Logout',
			path: '/confirm/logout',
			icon: <FortyButton><i class="fas fa-sign-out-alt"></i></FortyButton>
		}
	const invalidUserItem = {
			name: 'Login',
			path: '/auth',
			params: () => {return{prev: m.route.get()}},
			icon: <FortyButton><i class="fas fa-sign-in-alt"></i></FortyButton>
		
		}
const menuList = (userRoles) => {
	return [
		(userRoles.includes('user') ? {
			name: 'Account',
			path: '/users/account',
			icon: <FortyButton><i class="fas fa-user"></i></FortyButton>
		} : ''),
		(userRoles.includes('admin') ? {
			name: 'Admin',
			path: '/admin',
			icon: <FortyButton><i class="fas fa-tools"></i></FortyButton>
		} : ''),
		{
			name: 'Launcher',
			path: '/launcher',
			icon: <FortyButton><img src="/favicon.ico" /></FortyButton>
		},
		{
			name: 'Festivals',
			path: '/series/pregame',
			icon: <FortyButton><i class="fas fa-icons"></i></FortyButton>
		},
		(userRoles.includes('user') ? {
			name: 'Research',
			path: '/research',
			icon: <FortyButton><i class="fas fa-clipboard-check"></i></FortyButton>
		} : ''),
		(userRoles.includes('user') ? {
			name: 'Theme',
			path: '/themer/schedule',
			icon: <FortyButton><i class="fas fa-palette"></i></FortyButton>
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