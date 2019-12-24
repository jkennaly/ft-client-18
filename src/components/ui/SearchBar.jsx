// src/components/ui/SearchBar.jsx

import m from 'mithril'
import _ from 'lodash'

import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchField from '../fields/SearchField.jsx';

import {remoteData} from '../../store/data.js'

const rawSeries = pattern => pattern ? remoteData.Series.patternMatch(pattern, 2) : []
const rawArtists = pattern => pattern ? remoteData.Artists.remoteSearch(pattern, 3) : Promise.resolve([])

const SearchBar = vnode => {
	var menuHidden = true
	var menuItems = []
	var lastRoute = ''
	const searchObject = {
		setResults: function(pattern) {
			rawArtists(pattern)
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
					const seriesGroup = seriesItems.length ? [{name: 'Festivals'}].concat(seriesItems) : []
					const artistGroup = artistItems.length ? [{name: 'Artists'}].concat(artistItems) : []
					menuItems = [].concat(seriesGroup).concat(artistGroup)
				})
				.then(() => m.redraw())
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
		view: (vnode) => <div class="ft-search-bar">
				<SearchField 
					patternChange={searchObject.setResults}
					//ph={`Festivals & Artists`}
				/>
			<CollapsibleMenu 
				menu={searchObject.getResults()} 
				collapsed={menuHidden}
				itemClicked={() => {
					vnode.dom.querySelector('input[name="search-input"]').value = ``
					searchObject.setResults(``)
					menuHidden = true

				}}
			/>
		</div>
	};

}

export default SearchBar;