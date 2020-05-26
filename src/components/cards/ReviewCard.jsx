// src/components/cards/ReviewCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx'

const ReviewCard = {
	  view: ({ attrs }) =>
	    <div class={"c44-card c44-card-review " + (attrs.uiClass ? attrs.uiClass : '')} >
	      <div class="c44-fields" onclick={e => attrs.popModal('review', {
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

