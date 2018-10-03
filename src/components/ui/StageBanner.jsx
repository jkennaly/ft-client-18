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
			<DisplayButton icon={<i class="fas fa-bars"/>} />
		</div>
};

export default StageBanner;