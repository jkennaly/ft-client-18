// src/components/ui/DetailBanner.jsx

import m from 'mithril';

import DetailTitle from './DetailTitle.jsx';
import LogoutButton from './LogoutButton.jsx';

import BannerButton from '../ui/BannerButton.jsx';
import Icon from '../fields/Icon.jsx'

const DetailBanner = {
	view: ({ attrs }) =>
		<div class="ft-stage-banner">
			<DetailTitle title={attrs.title} />
			<DisplayButton icon={<Icon name="menu"/>} />
		</div>
};

export default DetailBanner;