// SeriesView.jsx


import m from 'mithril'
import _ from 'lodash'

import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';

import {remoteData} from '../../store/data';

const user = _.memoize(attrs => _.isInteger(attrs.userId) ? attrs.userId : 0, attrs => attrs.userId)
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []

const SeriesView = {
	oninit: ({attrs}) => {
		remoteData.Series.remoteCheck()

		if (attrs.titleSet) attrs.titleSet(`Festivals`)
	},
	view: ({attrs}) => <div class="main-stage">
		<CardContainer>
			{

				remoteData.Series.list
					.map(series => <SeriesCard data={series} eventId={series.id}/>)
			}
		</CardContainer>
	</div>
}
export default SeriesView;
