// src/components/ui/SearchExapnse.jsx

import m from "mithril"
import _ from "lodash"

import BannerButton from "./BannerButton.jsx"
import CollapsibleMenu from "./CollapsibleMenu.jsx"
import Icon from "../fields/Icon.jsx"
import SearchField from "../fields/SearchField.jsx"

import { remoteData } from "../../store/data.js"

const rawSeries = pattern =>
	pattern ? remoteData.Series.patternMatch(pattern, 2) : []
const rawArtists = pattern =>
	pattern ? remoteData.Artists.remoteSearch(pattern, 3) : Promise.resolve([])
const rawUsers = pattern =>
	pattern ? remoteData.Users.remoteSearch(pattern, 3) : Promise.resolve([])
const body = dom => {
	if (!dom) throw new Error("not valid DOM", dom)
	if (dom.nodeName === "BODY") return dom
	return body(dom.parentNode)
}
const isHeader = (stopNode, el) => {
	if (stopNode.isSameNode(el)) return false
	if (el.classList.contains("ft-menu-item-header")) return true
	return isHeader(stopNode, el.parentNode)
}
const SearchExapnse = vnode => {
	var menuHidden = true
	var menuLock = true
	var menuItems = []
	var lastRoute = ""
	const hideMenu = dom => e => {
		//console.log("SearchExapnse dom e", menuHidden, dom.contains(e.target))
		const contained = dom.contains(e.target)
		const excepted =
			e.target.name === "search-input" ||
			(contained && isHeader(dom, e.target))
		//console.log("hideMenu call", excepted, e.target)
		if (excepted) {
			e.stopPropagation()
			return false
		}
		if (!contained) {
			menuLock = true
		} else {
			menuLock = !menuLock
		}
		m.redraw()
	}
	const searchObject = {
		setResults: function(pattern) {
			Promise.all([rawArtists(pattern), rawUsers(pattern)])
				//.then(artists => console.log('setResults artists', pattern, artists) || artists)
				.then(([artists, users]) => {
					const series = rawSeries(pattern)
					const seriesItems = series.map(s => {
						return {
							name: s.name,
							path: "/series/pregame/" + s.id,
							group: "Festivals",
						}
					})
					const artistItems = _.take(artists, 3).map(a => {
						return {
							name: a.name,
							path: "/artists/pregame/" + a.id,
							group: "Artists",
						}
					})
					const userItems = _.take(users, 3).map(a => {
						return {
							name: a.username,
							path: "/users/pregame/" + a.id,
							group: "People",
						}
					})
					const seriesGroup = seriesItems.length
						? [{ name: "Festivals", header: true }].concat(
								seriesItems
						  )
						: []
					const artistGroup = artistItems.length
						? [{ name: "Artists", header: true }].concat(
								artistItems
						  )
						: []
					const userGroup = userItems.length
						? [{ name: "People", header: true }].concat(userItems)
						: []
					menuItems = [...seriesGroup, ...artistGroup, ...userGroup]
				})
				.then(() => m.redraw())
				.catch(console.error)
		},
		getResults: function() {
			if (menuItems.length) menuHidden = false
			return menuItems
		},
	}
	return {
		oninit: vnode => (lastRoute = m.route.get()),
		onbeforeupdate: vnode => {
			if (lastRoute !== m.route.get()) {
				menuHidden = true
				lastRoute = m.route.get()
			}
			return true
		},
		/*
		oncreate: ({dom}) => {
			const vpw = document.body.offsetWidth
			const elWidth = vpw > 799 ? '10em' : '50px'
			dom.style.width = elWidth

		},
		*/
		oncreate: ({ attrs, dom }) => {
			body(dom).addEventListener("click", hideMenu(dom))
		},
		onremove: ({ attrs, dom }) => {
			body(dom).removeEventListener("click", hideMenu(dom))
		},
		view: vnode => (
			<div class="ft-search-expanse">
				<BannerButton
					icon={<Icon name="search" />}
					clickFunction={e => {
						//console.log("Search Icon Click", menuLock, menuHidden)
						menuLock = false
						menuHidden = false
						e.stopPropagation()
						searchObject.setResults(``)
					}}
					classes={!menuLock && !menuHidden ? "hidden" : ""}
				/>
				<CollapsibleMenu
					menu={searchObject.getResults()}
					collapsed={menuLock || menuHidden}
					left={true}
					itemClicked={() => {
						vnode.dom.querySelector(
							'input[name="search-input"]'
						).value = ``
						searchObject.setResults(``)
						//menuHidden = true
					}}
					header={
						<SearchField
							patternChange={searchObject.setResults}
							collapsed={menuLock || menuHidden}
							//fieldBlur={(e) => {console.log('blurring', e);if(e.explicitOriginalTarget) menuLock = true;}}
							//fieldFocus={() => {menuLock = false;}}
							//ph={`Festivals & Artists`}
						/>
					}
				/>
			</div>
		),
	}
}

export default SearchExapnse
