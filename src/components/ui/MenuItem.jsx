// src/components/ui/MenuItem.jsx

import m from "mithril"

import MenuField from "../fields/MenuField.jsx"

const hide = el => el.classList.add("hidden")
const show = el => el.classList.remove("hidden")

const MenuItem = {
	view: ({ attrs }) => (
		<div
			class={
				//the item is disabled if theres is not a valid path or
				m.route.get() &&
				new RegExp(
					m.route.get().replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")
				).test(attrs.data.path)
					? `ft-menu-item-selected`
					: attrs.data.header
					? `ft-menu-item-header`
					: attrs.data.path || attrs.clickFunction
					? "ft-menu-item"
					: "ft-menu-item-disabled"
			}
			onclick={() => {
				//console.log('MenuItem click', attrs)
				if (attrs.data.header) {
					const groupSelector = `[data-group="${attrs.data.name}"]`
					const items = Array.from(
						document.querySelectorAll(groupSelector)
					)
					if (!items || !items.length) return
					const itemsHidden = items[0].classList.contains("hidden")
					const toggle = itemsHidden ? show : hide
					return items.forEach(toggle)
				}
				if (attrs.data.path && attrs.data.params)
					m.route.set(attrs.data.path, attrs.data.params())
				if (attrs.data.path) m.route.set(attrs.data.path)
				if (attrs.data.href) window.location.assign(attrs.data.href)
				if (attrs.clickFunction) attrs.clickFunction()
			}}
			data-group={attrs.data.group}
		>
			<div class="ft-menu-item-fields">
				{attrs.data.icon ? attrs.data.icon : ""}
				<MenuField display={attrs.data.name} />
			</div>
		</div>
	),
}

export default MenuItem
