// src/components/gametime/GametimeSearchBar.jsx

import m from 'mithril'
import _ from 'lodash'
import smartSearch from 'smart-search'

import CollapsibleMenu from '../ui/CollapsibleMenu.jsx';
import SearchField from '../fields/SearchField.jsx';

import {subjectData} from '../../store/subjectData'


//sets
const rawSets = (subjectObject, count = 5) => {
	const sets = subjectData.sets(subjectObject)
	const setSearchStrings = sets
		.map(s => {return {subject: s.id, subjectType: SET}})
		//map to search string by removing everything but artist name
		.map(so => _.assign({}, so, {name: subjectData.name(so).replace(/(.*):(.*)/, '$1')}))
	return pattern => _.take(smartSearch(setSearchStrings,
		[pattern], {name: true}
		), count)
		.map(x => x.entry)
		.map(s => {return {
			name: s.name,
			path: '/gametime/3/' + s.subject
		}})
}	

 
//places
//days
//venue

const GametimeSearchBar = vnode => {
	var menuHidden = true
	var menuItems = []
	const searchObject = {
		setResults: function(pattern) {
			const setItems = vnode && vnode.attrs && vnode.attrs.gtDate ? rawSets(vnode.attrs.gtDate)(pattern) : []
			const setGroup = [{name: 'Sets'}, ...setItems]
			menuItems = [...setGroup]
		},
		getResults: function() {
			if(menuItems.length) menuHidden = false
			return menuItems
		}
	}
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

export default GametimeSearchBar;