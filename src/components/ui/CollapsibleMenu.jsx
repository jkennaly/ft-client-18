// CollapsibleMenu.jsx
// attrs:
//  selected
//  stateChange
//  collapsed
//  menu
//  bannerMenu
//  subMenu
//  menuName
//  idFields
//  preLoad


import m from 'mithril'
import _ from 'lodash'



import MenuItem from './MenuItem.jsx';
const classes = attrs => ('banner-menu-content ') + (attrs.collapsed ? 'hidden' : '')
const CollapsibleMenu = {
	view: ({attrs}) =>
		<div class={"banner-menu"}>
            <div class={classes(attrs)}>
                    {attrs.menu.map(i => <MenuItem 
                    	data={i}
                        clickFunction={attrs.itemClicked}
                    />)}
            </div>
        </div>
};

export default CollapsibleMenu;