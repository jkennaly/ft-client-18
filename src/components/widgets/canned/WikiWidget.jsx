// src/components/widgets/canned/WikiWidget.jsx

import m from 'mithril'

import FixedCardWidget from '../FixedCard.jsx';
import BannerButton from '../../ui/BannerButton.jsx';
import Icon from '../../fields/Icon.jsx'



const WikiWidget = {
		view: ({attrs}) => <FixedCardWidget 
				header="Wikipedia" 
			button={<BannerButton 
				icon={<a href={attrs.link} target="_blank"><Icon name="wikipedia" /></a>}
				/>}
				>

				

				{
					m.trust(attrs.text)
				}
			</FixedCardWidget>	
};

export default WikiWidget;