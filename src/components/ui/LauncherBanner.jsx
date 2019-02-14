// LauncherBanner.jsx

import m from 'mithril';

import StageTitle from './StageTitle.jsx';
import DisplayButton from './DisplayButton.jsx';
import BannerButton from './BannerButton.jsx';
import CollapsibleMenu from './CollapsibleMenu.jsx';
import SearchBar from './SearchBar.jsx';


const LauncherBanner = {
	view: ({ attrs, children }) =>
		<div class="stage-banner-container">
			<div class="stage-banner">
				<StageTitle title={attrs.title} />
				<SearchBar />
				{
					/*
			<CollapsibleMenu 
				menu={menuList.concat([userValid ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>


					*/
				}

				<BannerButton 
					icon={<i class="fas fa-envelope"/>} 
					clickFunction={e => m.route.set('/messages')}
				/>
				<DisplayButton icon={<i class="fas fa-bars"/>} />
			</div>
			{children}
		</div>
};

export default LauncherBanner;