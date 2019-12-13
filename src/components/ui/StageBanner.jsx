// StageBanner.jsx

import m from 'mithril';

import StageTitle from './StageTitle.jsx';
import LogoutButton from './LogoutButton.jsx';

import BannerButton from '../ui/BannerButton.jsx';

const StageBanner = {
	view: ({ attrs }) =>
		<div class="ft-stage-banner">
			<DisplayButton icon={<i class="fas fa-bars"/>} />
		</div>
};

export default StageBanner;