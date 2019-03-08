// GametimeBanner.jsx

import m from 'mithril';

import BannerButton from '../ui/BannerButton.jsx';
import SearchBar from '../ui/SearchBar.jsx';


const GametimeBanner = {
	view: ({ attrs, children }) =>
		<div class="gametime-banner-container">
			<div class="gametime-banner">
				<SearchBar />
				{
					/*
			<CollapsibleMenu 
				menu={menuList.concat([userValid ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>


					*/
				//console.log('GametimeBanner dateId', attrs.dateId)
				}

				{attrs.dateId ?
				//go to now playing
				<BannerButton 
					icon={<i class="fas fa-clock"/>} 
					clickFunction={e => m.route.set(`/gametime/8/${attrs.dateId}`)}
				/>
				: ''}
				{attrs.dayId ?
				//go to schedule view
				<BannerButton 
					icon={<i class="fas fa-calendar-alt"/>} 
					clickFunction={e => m.route.set(`/gametime/9/${attrs.dayId}`)}
				/>
				: ''}
				{//exit back to launcher
				<BannerButton 
					icon={<i class="fas fa-external-link-alt"/>} 
					clickFunction={e => m.route.set('/launcher')}
				/>
			}
			</div>
			{children}
		</div>
};

export default GametimeBanner;