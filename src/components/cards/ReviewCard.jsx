// src/components/cards/ReviewCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx'

const ReviewCard = {
	  view: ({ attrs }) =>
	    <div class={"ft-card ft-card-review " + (attrs.uiClass ? attrs.uiClass : '')} >
	      <div class="ft-fields" onclick={e => attrs.popModal('review', {
			subjectObject: attrs.subjectObject ? attrs.subjectObject : {
				subject: attrs.data.id,
				subjectType: attrs.subjectType ? attrs.subjectType : ARTIST
			}
	      })}>
	        <ComposedNameField fieldValue={'Review ' + (attrs.data && attrs.data.name || attrs.name)} />
	      </div>
	    </div>
}

export default ReviewCard;

