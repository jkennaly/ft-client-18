// CheckinToggle.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'

import {subjectData} from '../../../store/subjectData';
import {sameSubject} from '../../../services/subjectFunctions';
import ToggleControl from '../ToggleControl.jsx';
import Auth from '../../../services/auth.js'
const auth = new Auth()


const currentlyCheckedIn = subjectObject => {
	const lastCheckin = subjectData.checkedIn({subject: auth.userId(), subjectType: subjectData.USER})

	const subEventCheckin = lastCheckin.subjectType !== subjectObject.subjectType && subjectData.subEvent(subjectObject, lastCheckin)
	const checkedIn = subEventCheckin || sameSubject(lastCheckin, subjectObject)
	console.log('checkIn toggle currentlyCheckedIn', subjectObject, lastCheckin, subEventCheckin, checkedIn)
	return checkedIn

}

const CheckinToggle = {
		view: ({attrs}) => <ToggleControl
			offLabel={attrs.offLabel ? attrs.offLabel : 'Not there'}
			onLabel={attrs.onLabel ? attrs.onLabel : 'I\'m here (click for live schedule)'}
			
			getter={() => {
				 return currentlyCheckedIn(attrs.subjectObject)

			}}
			setter={newState => {
				//console.log('CheckinToggle setter start',attrs.subjectObject)
				//when toggled:
					//if the user was not checked in, check in the user to the subject
					const notCheckedIn = !currentlyCheckedIn(attrs.subjectObject)
					const checkinAllowed = notCheckedIn && subjectData.active(attrs.subjectObject)
					if(checkinAllowed) subjectData.checkIn(attrs.subjectObject)
					//open the subject in gametime
					//console.log('CheckinToggle setter checkinAllowed',checkinAllowed)
					m.route.set(`/gametime/${attrs.subjectObject.subjectType}/${attrs.subjectObject.subject}`)
			}}

		/>
}

export default CheckinToggle;