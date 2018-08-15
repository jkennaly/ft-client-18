// ConferenceView.jsx

const m = require("mithril");

import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConferenceCard from '../../components/cards/ConferenceCard.jsx';

const ConferenceView = (conferences, auth) => 
	<div>
		<StageBanner action={() => auth.logout()} title="Conferences" />,
		<CardContainer>
			{
				conferences
					.map((conference) => <ConferenceCard conference={conference} />)
			}
		</CardContainer>
	</div>

export default ConferenceView;