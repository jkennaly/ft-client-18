// ReviewCard.jsx

import m from 'mithril'
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  ReviewModal from '../modals/ReviewModal.jsx';

const ReviewCard = vnode => { 
	var reviewing = false
	var userId = 0
	return {
		oninit: ({attrs}) => {
			userId = auth.userId()
		},
		//onupdate: () => console.log('ReviewCard Update'),
	  view: ({ attrs }) =>
	    <div class={"ft-card ft-card-review " + (attrs.uiClass ? attrs.uiClass : '')} >
	      <div class="ft-fields" onclick={e => reviewing = true}>
	        <ComposedNameField fieldValue={'Review ' + (attrs.data && attrs.data.name || attrs.name)} />
	      </div>
	      <ReviewModal 
			display={reviewing} 
			hide={() => reviewing = false}
			subject={attrs.subjectObject ? attrs.subjectObject : {
				subject: attrs.data.id,
				subjectType: attrs.subjectType ? attrs.subjectType : 2
			}}
			user={userId}
	      />
	    </div>
}};

export default ReviewCard;

