// MenuItem.jsx

const m = require("mithril");

import MenuField from '../fields/MenuField.jsx';

const MenuItem = {
  view: ({ attrs }) =>
    <div class="menu-item" onclick={() => {
    	m.route.set(attrs.data.path)
    	if(attrs.clickFunction) attrs.clickFunction()
    }}>
		<div class="menu-item-fields">
			<MenuField display={attrs.data.name}/>
		</div>
    </div>
};

export default MenuItem;
