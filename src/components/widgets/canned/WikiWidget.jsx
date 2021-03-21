// src/components/widgets/canned/WikiWidget.jsx

import m from 'mithril'

import FixedCardWidget from '../FixedCard.jsx';
import BannerButton from '../../ui/BannerButton.jsx';



const WikiWidget = {
		view: ({attrs}) => <FixedCardWidget 
				header="Wikipedia" 
			button={<BannerButton 
				icon={<a href={attrs.link} target="_blank"><i class="fab fa-wikipedia-w" /></a>}
				/>}
				>

				

				{
					m.trust(attrs.text)
				}
			</FixedCardWidget>	
};

export default WikiWidget;