// DisplayButton.jsx

const m = require("mithril");

import CollapsibleMenu from './CollapsibleMenu.jsx';

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


const DisplayButton = vnode => {
	var menuHidden = true
	var userValid = true
	const validUserItem = {
			name: 'Logout',
			path: '/confirm/logout'
		}
	const invalidUserItem = {
			name: 'Login',
			path: '/auth'
		}

	const menuList = [
		{
			name: 'Launcher',
			path: '/launcher'
		},
		{
			name: 'Festivals',
			path: '/series/pregame'
		}
	]
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userValid = id)
				.catch(() => {userValid = false; m.redraw()})
		},
		onupdate: () => {
			auth.getFtUserId()
				.then(id => userValid = id)
				.catch(() => {userValid = false; m.redraw()})
		},
		view: ({ attrs }) => <div>
			<CollapsibleMenu 
				menu={menuList.concat([userValid ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>
			<div class="nav-button" onclick={() => menuHidden = !menuHidden}>
				{attrs.icon}
			</div>
		</div>
	};

}

export default DisplayButton;