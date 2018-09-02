// MenuItem.jsx
// attrs:
//  menuName
//  selected
//  display
//  stateChange
//	idFields
//	superMenuName
//	preLoad

const m = require("mithril");

import MenuField from '../fields/MenuField.jsx';
import CollapsibleMenu from './CollapsibleMenu.jsx';

// Local state
import {getAppPerspective} from '../../store/ui';
import {getAppContext} from '../../store/ui';
import {getFilterPreLoad} from '../../store/ui';
import {parameterNames} from '../../store/ui';
import {selected} from '../../store/ui';
import {simpleToggleSelection} from '../../store/ui';

const subSelecters = (selecterType, selected, fields, preLoad) => parameterNames[selecterType](selected)(fields, preLoad)

const classes = attrs => 'menu-item ' + (attrs.selected ? 'menu-item-selected' : '')
const toggleSubMenu = attrs => () => simpleToggleSelection(attrs.display + (attrs.menuName ? attrs.menuName : ''))
const finalMenuSelection = attrs => () => {
	//console.log('finalMenuSelection stateChange: ')
	//console.log(attrs.superMenuName)
	const currentPreLoad = getFilterPreLoad(getAppContext(), getAppPerspective())
	//console.log(currentPreLoad)
	//console.log(attrs.preLoad)
	if(_.isString(attrs.preLoad)) throw 'string supplied to setFilterNames with attrs.preLoad '
	if(!attrs.superMenuName) return attrs.stateChange(attrs.display, attrs.display, attrs.preLoad)
	//console.log(attrs.menuName)
	//console.log(attrs.display)
	//console.log(attrs.stateChange)
	//console.log(attrs.preLoad)
	return attrs.stateChange(attrs.menuName, attrs.display, attrs.preLoad)
}
const itemHasSubMenu = attrs => {
	if(attrs.superMenuName) return false
	if(!attrs.menuName) return false
	const currentPreLoad = getFilterPreLoad(getAppContext(), getAppPerspective())
	const subs = subSelecters(attrs.menuName, attrs.display, attrs.idFields, currentPreLoad)
	//console.log(subs)
	//console.log(attrs.menuName)
	//console.log(attrs.display)
	//console.log(attrs.idFields)
	const retVal = subs.length
	//console.log('itemHasSubMenu')
	//console.log(currentPreLoad)
	//console.log(attrs.preLoad)
	//console.log(retVal)

	return retVal
}
const itemClicked = attrs => itemHasSubMenu(attrs) ? toggleSubMenu(attrs) : finalMenuSelection(attrs)
//itemClicked needs to add alphasort to selected stack if there are subSelecters
const showSubMenu = attrs => {
	if(!itemHasSubMenu(attrs)) return ''
/*	return <div>{parameterNames[attrs.menuName](attrs.display)(attrs.idFields)}</div> */

	return <CollapsibleMenu 
			menu={itemHasSubMenu(attrs) ? subSelecters(attrs.menuName, attrs.display, attrs.idFields, getFilterPreLoad(getAppContext(), getAppPerspective())) : []}
			collapsed={selected.indexOf(attrs.display + (attrs.menuName ? attrs.menuName : '')) < 0}
			selected={''}
			stateChange={attrs.stateChange}
			subMenu={true}
			menuName={attrs.display}
			superMenuName={attrs.menuName}
			preLoad={attrs.preLoad}
		/>
		
}
const MenuItem = {
  view: ({ attrs }) =>
    <div class={classes(attrs)} onclick={itemClicked(attrs)}>
		<div class="menu-item-fields">
		<MenuField display={attrs.display} selected={attrs.selected}/>
		{showSubMenu(attrs)}
		</div>
    </div>
};

export default MenuItem;

/*
<CollapsibleMenu 
				menu={getAllSortNames(getAppContext(), getAppPerspective())} 
				collapsed={hideDisplay(attrs)} 
				selected={getSortName(getAppContext(), getAppPerspective())} 
				stateChange={setSortName(getAppContext(), getAppPerspective())}
			/>
*/