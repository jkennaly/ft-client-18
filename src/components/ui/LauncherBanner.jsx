// src/components/ui/ LauncherBanner.jsx

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data'

import StageTitle from './StageTitle.jsx';
import DisplayButton from './DisplayButton.jsx';
import LiveButton from './LiveButton.jsx';
import BannerButton from './BannerButton.jsx';
import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchBar from './SearchBar.jsx';

const {Flags: flags, Dates: dates} = remoteData

var titleCache = {}
const title = (attrs) => {
	const key = m.route.get()
	const cached = _.get(titleCache, key)
	if(cached) return cached
	if(attrs.titleGet()) return attrs.titleGet()
	return `Client-44`
}
const LauncherBanner = () => {

	return {
		
	view: ({ attrs, children }) =>
		<div class="c44-stage-banner-container">
			<div class="c44-stage-banner">
<<<<<<< HEAD
=======
			{_.uniqBy([
				...dates.checkedIn(attrs.userId),
				...dates.intended()
				], 'id').map(d => <LiveButton date={d} />)
			}
>>>>>>> 86cfeeb045b16bf0a308c9c8ef37b95fa30b2edf
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
						icon={<span class="fa-layers fa-fw c44-icon-stack">
						    <i class="fas fa-envelope"/>
						    {flags.pending([attrs.userId, attrs.userRoles]).length ? <i 
								class="fas fa-flag" 
								style="color:white;" 
								data-fa-transform="shrink-8 up-3.8 lec44-4"
							/> : ''}
  					</span>}
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