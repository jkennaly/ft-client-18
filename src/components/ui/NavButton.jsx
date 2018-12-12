// NavButton.jsx

import m from 'mithril'

const NavButton = {
	view: ({ attrs }) =>
		<button type="button" onclick={attrs.action}>
			{attrs.fieldValue}
		</button>
};

export default NavButton;