// MenuField.jsx

const m = require("mithril");
const classes = attrs => 'menu-field ' + (attrs.selected ? 'menu-item-selected' : '')
const MenuField = {
	view: ({ attrs }) =>
		<div class={classes(attrs)}>
			{attrs.display}
		</div >
};

export default MenuField;