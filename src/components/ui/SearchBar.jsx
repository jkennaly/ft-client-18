// SearchBar.jsx

import m from 'mithril'
import _ from 'lodash'

import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchField from '../fields/SearchField.jsx';

import {remoteData} from '../../store/data.js'

const rawSeries = pattern => remoteData.Series.patternMatch(pattern, 2)
const rawArtists = pattern => remoteData.Artists.patternMatch(pattern, 3)

const SearchBar = vnode => {
	var menuHidden = true
	var menuItems = []
	const searchObject = {
		setResults: function(pattern) {
			const series = rawSeries(pattern)
			const artists = rawArtists(pattern)
			const seriesItems = series.map(s => {return {
				name: s.name,
				path: '/series/pregame/' + s.id
			}})
			const artistItems = artists.map(a => {return {
				name: a.name,
				path: '/artists/pregame/' + a.id
			}})
			const seriesGroup = seriesItems.length ? [{name: 'Festivals'}].concat(seriesItems) : []
			const artistGroup = artistItems.length ? [{name: 'Artists'}].concat(artistItems) : []
			menuItems = [].concat(seriesGroup).concat(artistGroup)
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
		view: ({ attrs }) => <div>
				<SearchField patternChange={searchObject.setResults} />
			<CollapsibleMenu 
				menu={searchObject.getResults()} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>
		</div>
	};

}

export default SearchBar;