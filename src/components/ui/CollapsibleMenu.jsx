// CollapsibleMenu.jsx


const m = require("mithril");

// change selections
import {toggleSelection} from '../../store/ui';

import MenuItem from '../cards/MenuItem.jsx';
const classes = attrs => 'menu-content ' + (attrs.collapsed ? 'hidden' : '')
const CollapsibleMenu = {
	view: ({attrs}) =>
		<div class="collapsible-menu">
            <div class={classes(attrs)}>
                <ul class="collapsible-menu-list">
                    {attrs.menu.map(i => <li><MenuItem 
                    	display={i} 
                    	selected={attrs.selected === i}
                    	stateChange={attrs.stateChange}
                    /></li>)}
                </ul>
            </div>
        </div>
};

export default CollapsibleMenu;