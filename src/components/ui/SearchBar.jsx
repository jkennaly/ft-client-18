// src/components/ui/SearchBar.jsx

import m from 'mithril'
import _ from 'lodash'

import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchField from '../fields/SearchField.jsx';

import {remoteData} from '../../store/data.js'

const rawSeries = pattern => pattern ? remoteData.Series.patternMatch(pattern, 2) : []
const rawArtists = pattern => pattern ? remoteData.Artists.remoteSearch(pattern, 3) : Promise.resolve([])
const body = dom => {
    if(!dom) throw new Error('not valid DOM', dom)
    if(dom.nodeName === 'BODY') return dom
    return body(dom.parentNode)
}
const SearchBar = vnode => {
	var menuHidden = true
	var menuLock = true
	var menuItems = []
	var lastRoute = ''
    const hideMenu = dom => (e) => {
        //console.log('DisplayButton dom e', menuHidden, dom.contains(e.target))
        if(!dom.contains(e.target)) {menuLock = true }
        else {menuLock = !menuLock}
        m.redraw()
    }
	const searchObject = {
		setResults: function(pattern) {
			rawArtists(pattern)
			//.then(artists => console.log('setResults artists', pattern, artists) || artists)
				.then(artists => {
					const series = rawSeries(pattern)
					const seriesItems = series.map(s => {return {
						name: s.name,
						path: '/series/pregame/' + s.id
					}})
					const artistItems = _.take(artists, 3).map(a => {return {
						name: a.name,
						path: '/artists/pregame/' + a.id
					}})
					const seriesGroup = seriesItems.length ? [{name: 'Festivals', header: true}].concat(seriesItems) : []
					const artistGroup = artistItems.length ? [{name: 'Artists', header: true}].concat(artistItems) : []
					menuItems = [...seriesGroup, ...artistGroup]
				})
				.then(() => m.redraw())
				.catch(console.log)
		},
		getResults: function() {
			if(menuItems.length) menuHidden = false
			return menuItems
		}
	}
	return {
		oninit: vnode => lastRoute = m.route.get(),
		onbeforeupdate: vnode => {
			if(lastRoute !== m.route.get()) {
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
        oncreate: ({attrs, dom}) => {
            body(dom).addEventListener('click', hideMenu(dom))
        },
        onremove: ({attrs, dom}) => {
            body(dom).removeEventListener('click', hideMenu(dom))
        },
		view: (vnode) => <div class="ft-search-bar">
			<SearchField 
				patternChange={searchObject.setResults}
				//fieldBlur={(e) => {console.log('blurring', e);if(e.explicitOriginalTarget) menuLock = true;}}
				//fieldFocus={() => {menuLock = false;}}
				//ph={`Festivals & Artists`}
			/>
			<CollapsibleMenu 
				menu={searchObject.getResults()} 
				collapsed={menuLock || menuHidden}
				left={true}
				itemClicked={() => {
					vnode.dom.querySelector('input[name="search-input"]').value = ``
					searchObject.setResults(``)
					//menuHidden = true
				}}
			/>
		</div>
	};

}

export default SearchBar;