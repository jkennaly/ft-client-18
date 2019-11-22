// SearchBar.jsx

import m from 'mithril'
import _ from 'lodash'

import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchField from '../fields/SearchField.jsx';

import {remoteData} from '../../store/data.js'

const rawSeries = pattern => pattern ? remoteData.Series.patternMatch(pattern, 2) : Promise.resolve([])
const rawArtists = pattern => pattern ? remoteData.Artists.remoteSearch(pattern, 3) : Promise.resolve([])

const SearchBar = vnode => {
	var menuHidden = true
	var menuItems = []
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
	/*
	var userValid = true
	const validUserItem = {
			name: 'Logout',
			path: '/confirm/logout'
		}
	const invalidUserItem = {
			name: 'Login',
			path: '/auth'
		}

	const menuList = [
		{
			name: 'Launcher',
			path: '/launcher'
		},
		{
			name: 'Research',
			path: '/research'
		},
		{
			name: 'Festivals',
			path: '/series/pregame'
		},
		{
			name: 'Admin',
			path: '/admin'
		}
	]
	*/
	return {
		view: (vnode) => <div>
				<SearchField patternChange={searchObject.setResults} />
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