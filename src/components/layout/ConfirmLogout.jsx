// src/components/layout/ConfirmLogout.jsx

import m from 'mithril'
import Auth from '../../services/auth.js';
const auth = new Auth();

import UIButton from '../ui/UIButton.jsx'

const ConfirmLogout = (vnode) => { return {
	view: (vnode) =>
		<div class="c44-main-stage">
			Confirm Logout
			<UIButton action={() => auth.logout()} buttonName={'Logout'} />
			<UIButton action={() => m.route.set('/launcher')} buttonName={'Back to Launcher'} />

		</div>
}};

export default ConfirmLogout;