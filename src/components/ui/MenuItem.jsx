// MenuItem.jsx

import m from 'mithril'

import MenuField from '../fields/MenuField.jsx';

const MenuItem = {
  view: ({ attrs }) =>
    <div class={attrs.data.path ? "menu-item": "menu-item-disabled"} onclick={() => {
    	if(attrs.data.path) m.route.set(attrs.data.path)
    	if(attrs.clickFunction && attrs.data.path) attrs.clickFunction()
    }}>
		<div class="menu-item-fields">
			<MenuField display={attrs.data.name}/>
		</div>
    </div>
};

export default MenuItem;
