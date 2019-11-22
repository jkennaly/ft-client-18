// CheckinToggle.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'

import {subjectData} from '../../../store/subjectData';
import {sameSubject} from '../../../services/subjectFunctions';
import ToggleControl from '../ToggleControl.jsx';
import Auth from '../../../services/auth.js'
const auth = new Auth()


const currentlyCheckedIn = (userId, subjectObject) => {
	const lastCheckin = subjectData.checkedIn({subject: userId, subjectType: subjectData.USER})

	const subEventCheckin = lastCheckin && lastCheckin.subjectType !== subjectObject.subjectType && subjectData.subEvent(subjectObject, lastCheckin)
	const checkedIn = subEventCheckin || sameSubject(lastCheckin, subjectObject)
	//console.log('checkIn toggle currentlyCheckedIn', userId, subjectObject, lastCheckin, subEventCheckin, checkedIn)
	return checkedIn

}

const CheckinToggle = {
		view: ({attrs}) => <ToggleControl
			offLabel={attrs.offLabel ? attrs.offLabel : 'Not there'}
			onLabel={attrs.onLabel ? attrs.onLabel : 'I\'m here'}
			
			getter={() => {
				 return currentlyCheckedIn(attrs.userId, attrs.subjectObject)

			}}
			setter={newState => {
				//when toggled:
					//if the user was not checked in, check in the user to the subject
					const notCheckedIn = !currentlyCheckedIn(attrs.userId, attrs.subjectObject)
					const checkinAllowed = notCheckedIn && subjectData.active(attrs.subjectObject)
				//console.log('CheckinToggle setter start',attrs.userId, attrs.subjectObject, checkinAllowed)
					if(checkinAllowed) subjectData.checkIn(attrs.userId, attrs.subjectObject)
					//open the subject in gametime
					//console.log('CheckinToggle setter checkinAllowed',checkinAllowed)
					m.route.set(`/gametime/${attrs.subjectObject.subjectType}/${attrs.subjectObject.subject}`)
			}}
			permission={attrs.permission}

		/>
}

export default CheckinToggle;