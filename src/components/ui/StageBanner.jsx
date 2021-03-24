// src/components/ui/StageBanner.jsx

import m from 'mithril';

import StageTitle from './StageTitle.jsx';
import LogoutButton from './LogoutButton.jsx';

import BannerButton from '../ui/BannerButton.jsx';
import Icon from '../fields/Icon.jsx'

const StageBanner = {
	view: ({ attrs }) =>
		<div class="ft-stage-banner">
			<DisplayButton icon={<Icon name="menu"/>} />
		</div>
};

export default StageBanner;