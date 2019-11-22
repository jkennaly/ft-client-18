// SeriesDetail.jsx


import m from 'mithril'
import _ from 'lodash'
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ToggleControl from '../../components/ui/ToggleControl.jsx';

import {remoteData} from '../../store/data';


import SeriesDescriptionField from './fields/series/SeriesDescriptionField.jsx'
import SeriesWebsiteField from './fields/series/SeriesWebsiteField.jsx'

const user = _.memoize(attrs => _.isInteger(attrs.userId) ? attrs.userId : 0, attrs => attrs.userId)
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []
const id = () => parseInt(m.route.param('id'), 10)
const series = () => remoteData.Series.get(id())

const SeriesDetail = { 
	name: 'SeriesDetail',
	preload: (rParams) => {
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const seriesId = parseInt(rParams.id, 10)
		//messages.forArtist(seriesId)
		//console.log('Research preload', seriesId, festivalId, rParams)
		if(seriesId) return remoteData.Series.subjectDetails({subject: seriesId, subjectType: SERIES})
	},
	oninit: ({attrs}) => {
		if (attrs.titleSet) attrs.titleSet(remoteData.Series.getEventName(id()))

	},
	view: ({attrs}) => <div class="main-stage">
		{series() ? <ToggleControl
			offLabel={'Active'}
			onLabel={'On hiatus'}
			getter={() => _.get(series(), 'hiatus')}
			setter={newState => {
				remoteData.Series.updateInstance({hiatus: newState}, id())
			}}
			permission={roles(attrs) && roles(attrs).includes('admin')}
		/> : ''}
		{series() ? <SeriesDescriptionField id={id()} /> : ''}
		{series() ? <SeriesWebsiteField id={id()} /> : ''}
		<CardContainer>
			<FestivalCard  seriesId={id()} eventId={'new'}/>
			{
				(remoteData.Festivals.getMany(
							remoteData.Series.getSubIds(id()))
						)
					.sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10))
					.map(data => <FestivalCard  
						seriesId={data.series}
						festivalId={data.id}
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}
export default SeriesDetail;
