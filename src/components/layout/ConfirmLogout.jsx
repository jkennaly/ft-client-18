// ConfirmLogout.jsx

import m from 'mithril'

import UIButton from '../ui/UIButton.jsx'

const ConfirmLogout = (vnode) => { return {
	view: (vnode) =>
		<div class="main-stage">
			Confirm Logout
			<UIButton action={() => m.route.set('/auth')} buttonName={'Logout'} />
			<UIButton action={() => m.route.set('/launcher')} buttonName={'Back to Launcher'} />

		</div>
}};

export default ConfirmLogout;