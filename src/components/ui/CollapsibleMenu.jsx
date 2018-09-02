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


const m = require("mithril");
const _ = require("lodash");

// change selections
import {toggleSelection} from '../../store/ui';

import MenuItem from './MenuItem.jsx';
const classes = attrs => ((attrs.bannerMenu || attrs.subMenu) ? 'banner-menu-content ' : 'menu-content ') + (attrs.subMenu ? 'sub-menu-content ' : '') + (attrs.collapsed ? 'hidden' : '')
const CollapsibleMenu = {
	view: ({attrs}) =>
		<div class={(attrs.bannerMenu || attrs.subMenu) ? "banner-menu" : "collapsible-menu"}>
            <div class={classes(attrs)}>
                    {attrs.menu.map(i => <MenuItem 
                    	display={_.isString(i) ? i : i[0]} 
                    	selected={attrs.selected.indexOf(i) > -1}
                    	stateChange={attrs.stateChange}
                        menuName={attrs.menuName}
                        idFields={attrs.idFields}
                        preLoad={_.isString(i) ? {} : i[1]}
                        superMenuName={attrs.superMenuName}
                    />)}
            </div>
        </div>
};

export default CollapsibleMenu;