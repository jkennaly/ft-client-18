// MenuItem.jsx

import m from 'mithril'

import MenuField from '../fields/MenuField.jsx';



const MenuItem = {
  view: ({ attrs }) =>
    <div 
        class={(
            //the item is disabled if theres is not a valid path or 
            m.route.get() && (new RegExp(m.route.get().replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'))).test(attrs.data.path) ? `ft-menu-item-selected` :
                attrs.data.path || attrs.clickFunction ? "ft-menu-item" : 
                "ft-menu-item-disabled"
        )} 
        onclick={() => {
        	if(attrs.data.path && attrs.data.params) m.route.set(attrs.data.path, attrs.data.params())
        	if(attrs.data.path) m.route.set(attrs.data.path)
        	if(attrs.clickFunction) attrs.clickFunction()
        }}
    >
		<div class="ft-menu-item-fields">
            {attrs.data.icon ? attrs.data.icon : ''}
			<MenuField display={attrs.data.name}/>
		</div>
    </div>
}

export default MenuItem;
