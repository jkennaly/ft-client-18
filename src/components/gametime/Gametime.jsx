// Gametime.jsx

import m from 'mithril'

const Gametime = {
	view: (vnode) =>
		<div class="main-stage-gametime">
			{vnode.children}
			<span>It's on</span>
		</div>
};

export default Gametime;