// MenuField.jsx

const m = require("mithril");
const classes = attrs => 'menu-field ' + (attrs.selected ? 'menu-item-selected' : '')
const MenuField = {
	view: ({ attrs }) =>
		<span class={classes(attrs)}>
			{attrs.display}
		</span >
};

export default MenuField;