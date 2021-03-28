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
import Icon from '../fields/Icon.jsx'

const {Flags: flags, Dates: dates} = remoteData

const title = (attrs) => attrs.titleGet() ? attrs.titleGet() : `FestiGram`
const event = (attrs) => {
	//const key = m.route.get()
	//const cached = _.get(eventCache, key)
	//if(cached) return cached
	const event = attrs.eventGet && attrs.eventGet() ? attrs.eventGet() : {}
	//console.log('LauncherBanner event', event)
	//_.set(eventCache, key, event)
	return event
}
const LauncherBanner = () => {

	return {
		
	view: ({ attrs, children }) =>
		<div class="ft-stage-banner-container">
			<div class="ft-stage-banner">
			{_.uniqBy([
				...dates.checkedIn(attrs.userId),
				...dates.intended()
				], 'id').map(d => <LiveButton date={d} />)
			}
			{
				//console.log('LauncherBanner focusSubject', attrs.focusSubject())
			}
				{event(attrs) && event(attrs).src ? 
					<BannerButton 
						icon={<img src={event(attrs).src} />}
						clickFunction={event(attrs).buyModal ? e => {
							attrs.popModal('access', attrs.focusSubject())
						} : e => {}}
					/> 
					: ''
				}
				<StageTitle title={title(attrs)} /> 

				<SearchBar  />
				{
					/*
			<CollapsibleMenu 
				menu={menuList.concat([userValid ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>

<i 
								class="fas fa-flag" 
								style="color:white;" 
								data-fa-transform="shrink-8 up-3.8 left-4"
							/>
					*/
				}

				{attrs.userRoles.includes('user') ? 
					<BannerButton 
						icon={<span class="fa-layers fa-fw ft-icon-stack">
						    <Icon name="envelop" />
						    {flags.pending([attrs.userId, attrs.userRoles]).length ? 
						    	<Icon name="flag" classes="ft-icon-stack-upper-left c44-c-fw" />
						     : ''}
  					</span>}
						clickFunction={e => m.route.set('/messages')}
					/> 
					: ''
				}
				{ attrs.userRoles.length ? '' : <BannerButton 
					icon={<Icon name="enter" />} 
					clickFunction={e => m.route.set('/auth', {prev: m.route.get()})}
				/>
				}
				<DisplayButton 
					icon={<Icon name="menu" />} 
					userRoles={attrs.userRoles} 
				/>
			</div>
			{children}

			
		</div>
}}

export default LauncherBanner;