// src/components/ui/DetailBanner.jsx

import m from 'mithril';

import DetailTitle from './DetailTitle.jsx';
import LogoutButton from './LogoutButton.jsx';

import BannerButton from '../ui/BannerButton.jsx';

const DetailBanner = {
	view: ({ attrs }) =>
		<div class="c44-stage-banner">
			<DetailTitle title={attrs.title} />
			<DisplayButton icon={<i class="fas fa-bars"/>} />
		</div>
};

export default DetailBanner;