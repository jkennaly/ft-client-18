// ResearchWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import ArtistCard from '../../../components/cards/ArtistCard.jsx';
import FixedCardWidget from '../FixedCard.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';
import {remoteData} from '../../../store/data';

const ResearchWidget = vnode => {
	var userId = 0
	const routeId = _.flow(m.route.param, parseInt)('id')
	var festivalId = routeId
	var reviewing = false
	var subjectObject = {}
	var removed = []
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		onupdate: vnode => {
			if(vnode.attrs.festivalId && vnode.attrs.festivalId !== festivalId) {
				festivalId = vnode.attrs.festivalId
				m.redraw()
			}
		},
		view: (vnode) => <FixedCardWidget header="Festival Research">
			<ReviewModal 
				display={reviewing} 
				hide={sub => {removed.push(sub.sub);reviewing = false;}}
				subject={subjectObject}
				user={userId}
		    />
			{
				(userId && festivalId ? _.take(remoteData.Festivals.getResearchList(festivalId, userId)
					.filter(data => !_.includes(removed, data.id)), 10) : [])
					.map(data => <ArtistCard 
						data={data}
						festivalId={festivalId}
						overlay={'research'}
						addImage = {s => {
							subjectObject = _.clone(s)
							addingImage = true
						}}
						reviewSubject={s => {subjectObject = _.clone(s); reviewing = true;}}
					/>)
			}
		</FixedCardWidget>	
}};

export default ResearchWidget;