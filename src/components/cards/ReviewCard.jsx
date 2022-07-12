// src/components/cards/ReviewCard.jsx

import m from 'mithril'
import globals from '../../services/globals.js';

import ComposedNameField from '../fields/ComposedNameField.js'

const ReviewCard = {
	view: ({ attrs }) =>
		<div class={"ft-card ft-card-review " + (attrs.uiClass ? attrs.uiClass : '')} >
			<div class="ft-fields" onclick={e => attrs.popModal('review', {
				subjectObject: attrs.subjectObject ? attrs.subjectObject : {
					subject: attrs.data.id,
					subjectType: attrs.subjectType ? attrs.subjectType : globals.ARTIST
				}
			})}>
				<ComposedNameField fieldValue={'Review ' + (attrs.data && attrs.data.name || attrs.name)} />
			</div>
		</div>
}

export default ReviewCard;

