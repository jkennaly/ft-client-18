// PlaceCard.jsx
// attrs:
//	subjectObject

import m from 'mithril'
//import memoize from 'memoizee'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import  CheckedInUsersField from '../fields/CheckedInUsersField.jsx';
import {subjectData} from '../../store/subjectData'
import {so} from '../../services/subjectFunctions';

const makeSetSo = so('SET')
const makeDaySo = so('DAY')


const getPlaceModeSets = (subjectObject, dayId) => {
	const placeSetsForDay = subjectData.sets(makeDaySo(dayId))
		.filter(s => s.place === subjectObject.subject)
		.sort((a, b) => a.start - b.start)

	const noSets = !placeSetsForDay.length

	const activeSet = placeSetsForDay.find(s => subjectData.active(makeSetSo(s)))

	const nextSet = placeSetsForDay.find(s => subjectData.future(makeSetSo(s)))
	const lastSet = !noSets && placeSetsForDay[placeSetsForDay.length - 1]

	return {
		active: activeSet,
		future: nextSet,
		ended: lastSet
	}
	//



}

const setText = (subjectObject, dayId) => {
	const sets = getPlaceModeSets(subjectObject, dayId)
	const text = sets.active ? 'Now: ' + subjectData.name(makeSetSo(sets.active)) :
		sets.future ? 'Next: ' + subjectData.name(makeSetSo(sets.future)) :
		sets.ended ? 'Last: ' + subjectData.name(makeSetSo(sets.ended)) :
		''
	return text
}

const setRoute = (subjectObject, dayId) => {
	const sets = getPlaceModeSets(subjectObject, dayId)
	const route = sets.active ? '/gametime/3/' + sets.active.id :
		sets.future ? '/gametime/3/' + sets.future.id :
		sets.ended ? '/gametime/3/' + sets.ended.id :
		''
	return route
}

const setTimeText = (subjectObject, dayId) => {
	const sets = getPlaceModeSets(subjectObject, dayId)
	const route = sets.active ? moment(cm.timestamp).utc().fromNow() + ' left' :
		sets.future ? 'Starts in ' + moment(cm.timestamp).utc().fromNow() :
		sets.ended ? 'Ended ' + moment(cm.timestamp).utc().fromNow() :
		''
	return route
}

const PlaceCard = {
  view: ({ attrs }) =>
    <div class={"ft-card " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set(setRoute(attrs.subjectObject, attrs.dayId))}>

			{/*console.log('PlaceCard subjectObject', attrs.subjectObject)*/}
      <div class="ft-fields">
    	<ComposedNameField fieldValue={subjectData.name(attrs.subjectObject)} />
        <ComposedNameField fieldValue={setText(attrs.subjectObject, attrs.dayId)} />
    {/* set name if active, otherwise show next up if there is another set this day, otherwise show last played */}

    </div>
        <div class="ft-set-diff-fields">
        	<CheckedInUsersField subjectObject={attrs.subjectObject} />
      		<ComposedNameField fieldValue={setTimeText(attrs.subjectObject, attrs.dayId)} />
{/* time left in set/time until start/time since end */}
    	</div>
    </div>

};

export default PlaceCard;

