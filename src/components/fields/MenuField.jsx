// MenuField.jsx

import m from 'mithril'
const classes = attrs => 'ft-menu-field ' + (attrs.selected ? 'ft-menu-item-selected' : '')
const MenuField = {
	view: ({ attrs }) =>
		<span class={classes(attrs)}>
			{attrs.display}
		</span >
};

export default MenuField;