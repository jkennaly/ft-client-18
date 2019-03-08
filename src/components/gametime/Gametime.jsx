// Gametime.jsx

import m from 'mithril'
import localforage from 'localforage'

import Schedule from './Schedule.jsx'
import SetDetail from './SetDetail.jsx'
import GametimeBanner from './GametimeBanner.jsx';
import {subjectData} from '../../store/subjectData'
import Auth from '../../services/auth'
const auth = new Auth()


const Gametime = routingParameters => { 
	const subject = parseInt(routingParameters.subject, 10)
	const subjectType = parseInt(routingParameters.subjectType, 10)
	const subjectObject = {subject: subject, subjectType: subjectType}
	let userId, dateId, dayId, venueId, placeIds, userSubjectObject, dayBaseMoment

	//console.log('Gametime')
	//console.dir(subjectObject)

	return {
		oninit: vnode => {
			//console.log('Gametime oninit')
			//if there is a logged in user, get the following:
				//userId
			userId = auth.userId()
			userSubjectObject = {
				subject: userId,
				subjectType: subjectData.USER
			}
				//gametimeDate
			const checkedinDate = subjectData.checkedIn(userSubjectObject, {date:true})
			//console.log('Gametime oninit checkedinDateId', checkedinDate)
			
			const checkedinDateActive = subjectData.active(checkedinDate)
			const nonCheckinDates = !checkedinDateActive && subjectData.dates(subjectObject)
			const altId = nonCheckinDates && nonCheckinDates.length && nonCheckinDates[0].id
			//console.log('Gametime oninit 2')

			dateId = checkedinDateActive ? checkedinDate.subject : altId
			//console.log('Gametime oninit dateId', dateId)
			
				//gameTimeDay
			const possibleDays = dateId && subjectData.days({
				subject: dateId,
				subjectType: subjectData.DATE

			})
			//console.log('Gametime oninit possibleDays', possibleDays)
			const activeDays = possibleDays && possibleDays.filter(d => subjectData.active({
				subject: d.id,
				subjectType: subjectData.DAY
			}))
			//console.log('Gametime oninit activeDays', activeDays)
			const checkedinDayId = subjectData.checkedIn(userSubjectObject, {day:true})
			//console.log('Gametime oninit checkedinDayId', checkedinDayId)
			const checkinValid = checkedinDayId && activeDays.length !== 1 && _.some(possibleDays, d => d.id === checkedinDayId)
			dayId = checkinValid ? checkedinDayId : 
				activeDays && activeDays.length ? activeDays[0].id :
				possibleDays && possibleDays.length ? possibleDays[0].id :
				0
			//console.log('Gametime oninit dayId', dayId)
				//gametimeMinutes

				//gametimeVenue
				//gametimePlaces
				
		},
		view: (vnode) =>
			<div class="main-stage-gametime">
			<GametimeBanner 
				title={`gametime`} 
				dateId={dateId}
				dayId={dayId}
			
			/>
				<div class="main-stage-gametime-content-scroll">
					{subjectType === 9 ? <Schedule subjectObject={subjectObject}/> : 
					<SetDetail subjectObject={subjectObject}/> }
				</div>
			</div>
}};

export default Gametime;