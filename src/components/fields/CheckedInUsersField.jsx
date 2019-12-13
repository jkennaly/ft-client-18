// src/components/fields/CheckedInUsersField.jsx
//attrs: userId

import m from 'mithril'
import _ from 'lodash'

import {subjectData} from '../../store/subjectData';

import {so} from '../../services/subjectFunctions';
const makeUserSo = so('USER')

const allUsers = subjectObject => subjectData.users(subjectObject)

const currentUsers = subjectObject => !subjectData.active(subjectObject) ? [] : allUsers(subjectObject)
	.filter(u => subjectData.checkedIn(makeUserSo(u), {eventType: subjectObject.subjectType}) === subjectObject.subject)


const formerUsers = subjectObject => allUsers(subjectObject)
	.filter(u => subjectData.checkedIn(makeUserSo(u), {eventType: subjectObject.subjectType}) !== subjectObject.subject)


const CheckedInUsersField = vnode => {
	return {
		view: ({ attrs }) => <div class="ft-horizontal-fields ft-fb-fg4">

			{/* checked in users on left */
				currentUsers(attrs.subjectObject)
					//.filter(x => console.log('CheckedInUsersField currentUsers', x) || true)
			.map(u => <i class="fas fa-user ft-als-l"/>)
			}
			{/* checked out users on right */
				formerUsers(attrs.subjectObject)
					//.filter(x => console.log('CheckedInUsersField formerUsers', x) || true)
			.map(u => <i class="far fa-user ft-als-r"/>)
			}
        </div>
}} ;

export default CheckedInUsersField;