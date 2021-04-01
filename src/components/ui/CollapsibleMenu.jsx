// src/components/ui/CollapsibleMenu.jsx
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

import m from "mithril"
import _ from "lodash"

import MenuItem from "./MenuItem.jsx"
const classes = attrs =>
	"ft-banner-menu-content " + (attrs.left ? " ft-l-0" : " ft-r-0")
const CollapsibleMenu = {
	view: ({ attrs }) => (
		<div
			class={"ft-banner-menu ft-pr" + (attrs.collapsed ? " hidden" : "")}
		>
			{attrs.header && !attrs.collapsed ? attrs.header : ""}
			<div class={classes(attrs)}>
				{attrs.menu.map(i => (
					<MenuItem
						data={i}
						clickFunction={attrs.itemClicked}
						key={i.name}
					/>
				))}
			</div>
		</div>
	),
}

export default CollapsibleMenu
