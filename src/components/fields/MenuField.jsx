// src/components/fields/MenuField.jsx

import m from 'mithril'
const classes = attrs => 'c44-menu-field ' + (attrs.selected ? 'c44-menu-item-selected' : '')
const MenuField = {
	view: ({ attrs }) =>
		<span class={classes(attrs)}>
			{attrs.display}
		</span >
};

export default MenuField;