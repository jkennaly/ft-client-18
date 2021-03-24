// src/components/ui/LogoutButton.jsx

import m from 'mithril'
import Icon from '../fields/Icon.jsx'

const LogoutButton = {
	view: ({ attrs }) =>
		<div onclick={attrs.action}>
			<Icon class="exit"/>
		</div>
};

export default LogoutButton;