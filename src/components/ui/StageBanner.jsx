// StageBanner.jsx

const m = require('mithril');

import StageTitle from './StageTitle.jsx';
import LogoutButton from './LogoutButton.jsx';

import BannerButton from '../ui/BannerButton.jsx';
import FilterButton from '../ui/FilterButton.jsx';
import SortButton from '../ui/SortButton.jsx';

const StageBanner = {
	view: ({ attrs }) =>
		<div class="stage-banner">
			<StageTitle title={attrs.title} />
			<FilterButton 
				bannerMenu={true} 
				icon={<i class="fas fa-filter"/>}
				idFields={attrs.idFields}	
			/>
			<SortButton 
				bannerMenu={true} 
				icon={<i class="fas fa-sort"/>} 
				idFields={attrs.idFields}	
			/>
			<LogoutButton action={attrs.action} />
		</div>
};

export default StageBanner;