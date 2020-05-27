// src/components/cards/PlaceCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  CheckedInUsersField from '../fields/CheckedInUsersField.jsx';
import {remoteData} from '../../store/data'

const {Sets: sets, Places: places} = remoteData
const jsx = {
  view: ({ attrs }) =>
    <div 
    	class={"ft-card ft-card-place " + (attrs.uiClass ? attrs.uiClass : '')} 
    	onclick={() => attrs.setId && m.route.set(`/gametime/:subjectType/:subject`, {subject: attrs.setId, subjectType: SET})}
    >

			{/*console.log('PlaceCard subjectObject', attrs.subjectObject)*/}
      <div class="ft-fields">
    	<ComposedNameField fieldValue={places.getName(attrs.subjectObject.subject)} />
        <ComposedNameField fieldValue={attrs.setText} />
    {/* set name if active, otherwise show next up if there is another set this day, otherwise show last played */}

    </div>
        <div class="ft-set-diff-fields">
        	<CheckedInUsersField subjectObject={attrs.subjectObject} />
      		<ComposedNameField fieldValue={attrs.setTimeText} />
{/* time left in set/time until start/time since end */}
    	</div>
    </div>

}
const PlaceCard = {
  view: ({ attrs }) => {
  	const set = sets.getFiltered({stage: attrs.subjectObject.subject, day: attrs.dayId})
  		.find(s => sets.active(s.id))
  	console.log('PlaceCard', set)
  	const mapping = {
  		uiClass: attrs.uiClass,
  		subjectObject: attrs.subjectObject,
  		dayId: attrs.dayId,
  		setId: set ? set.id : 0,
  		setText: set ? sets.getEventName(set.id) : '',
  		setTimeText: set ? sets.getTimeString(set.id) : ''
  	}
  	return m(jsx, mapping)
  }
}
export default PlaceCard;

