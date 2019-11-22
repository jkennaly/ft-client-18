// LauncherBanner.jsx

import m from 'mithril'
import _ from 'lodash'

import StageTitle from './StageTitle.jsx';
import DisplayButton from './DisplayButton.jsx';
import BannerButton from './BannerButton.jsx';
import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchBar from './SearchBar.jsx';

var titleCache = {}
const title = (attrs) => {
	const key = m.route.get()
	const cached = _.get(titleCache, key)
	if(cached) return cached
	if(attrs.titleGet()) return attrs.titleGet()
	return `FestiGram`
}
const LauncherBanner = () => {

	return {
		
	view: ({ attrs, children }) =>
		<div class="stage-banner-container">
			<div class="stage-banner">
				<StageTitle title={title(attrs)} />
				<SearchBar  />
				{
					/*
			<CollapsibleMenu 
				menu={menuList.concat([userValid ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>


					*/
				}

				{attrs.userRoles.includes('user') ? 
					<BannerButton 
						icon={<i class="fas fa-envelope"/>}
						clickFunction={e => m.route.set('/messages')}
					/> 
					: ''
				}
				{ attrs.userRoles.length ? '' : <BannerButton 
					icon={<i class="fas fa-sign-in-alt"/>} 
					clickFunction={e => m.route.set('/auth', {prev: m.route.get()})}
				/>
				}
				<DisplayButton icon={<i class="fas fa-bars"/>} userRoles={attrs.userRoles} />
			</div>
			{children}
		</div>
}}

export default LauncherBanner;