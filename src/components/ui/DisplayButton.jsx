// DisplayButton.jsx

import m from 'mithril'

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
			name: 'Research',
			path: '/research'
		},
		{
			name: 'Festivals',
			path: '/series/pregame'
		},
		{
			name: 'Admin',
			path: '/admin'
		}
	]
	return {
		oninit: () => {
			auth.getFtUserId('DisplayButton oninit')
				.then(id => userValid = id)
				.catch(err => {
					//console.log('DisplayButton auth err')
					//console.log(err)
					userValid = false; 
					//m.redraw()

				})
		},
		/*
		onupdate: () => {
			auth.getFtUserId('DisplayButton onupdate')
				.then(id => userValid = id)
				.then(x => {
					console.log('DisplayButton id ' + x)
					return x
				})
				.catch(err => {
					console.log('DisplayButton auth err')
					console.log(err)
					userValid = false; 

				})
		},
		*/
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