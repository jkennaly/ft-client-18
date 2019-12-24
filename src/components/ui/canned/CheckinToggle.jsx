// src/components/ui/canned/CheckinToggle.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../store/data';
import {subjectData} from '../../../store/subjectData';
import {sameSubject} from '../../../services/subjectFunctions';
import ToggleControl from '../ToggleControl.jsx';
import Auth from '../../../services/auth.js'
const auth = new Auth()

const {Messages: messages} = remoteData



		
const CheckinToggle = {
		view: ({attrs}) => <ToggleControl
			offLabel={attrs.offLabel ? attrs.offLabel : 'Not there'}
			onLabel={attrs.onLabel ? attrs.onLabel : 'I\'m here'}
			
			getter={() => {
				 return messages.implicit(attrs.subjectObject, attrs.userId)

			}}
			setter={newState => {
				//when toggled:
					//if the user was not checked in, check in the user to the subject
					const notCheckedIn = !messages.implicit(attrs.subjectObject, attrs.userId)
					const checkinAllowed = _.isBoolean(attrs.checkinAllowed) ? attrs.checkinAllowed :  notCheckedIn && subjectData.active(attrs.subjectObject) && attrs.permission
				//console.log('CheckinToggle setter start',attrs.userId, attrs.subjectObject, checkinAllowed)
				console.log('CheckinToggle', attrs.subjectObject, attrs.userId, notCheckedIn, checkinAllowed, subjectData.active(attrs.subjectObject), newState)
					if(checkinAllowed) subjectData.checkIn(attrs.subjectObject)
					//open the subject in gametime
					//console.log('CheckinToggle setter checkinAllowed',checkinAllowed)
					m.route.set(`/gametime/${attrs.subjectObject.subjectType}/${attrs.subjectObject.subject}`)
			}}
			permission={attrs.permission}

		/>
}

export default CheckinToggle;