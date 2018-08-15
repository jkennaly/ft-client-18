// CFPView.jsx


const m = require("mithril");

import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import CFPCard from '../../components/cards/CFPCard.jsx';

const CFPView = (conferences, auth) => 
	<div>
		<StageBanner action={() => auth.logout()} title="Call for Papers" />,
		<CardContainer>
			{
				conferences
					.filter(conference => conference.CFP)
					.map(conferenceWithCFP => <CFPCard cfp={true} conference={conferenceWithCFP} />)
			}
		</CardContainer>
	</div>

export default CFPView;