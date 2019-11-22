// Gametime.jsx

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})

import Schedule from './Schedule.jsx'
import NowPlaying from './NowPlaying.jsx'
import Locations from './Locations.jsx'
import SetDetail from './SetDetail.jsx'
import GametimeBanner from './GametimeBanner.jsx';
import {subjectData} from '../../store/subjectData'
import {remoteData} from '../../store/data'
import Auth from '../../services/auth'
const auth = new Auth()




const Gametime = routingParameters => { 
	const subject = parseInt(routingParameters.subject, 10)
	const subjectType = parseInt(routingParameters.subjectType, 10)
	const subjectObject = {subject: subject, subjectType: subjectType}
	let dateId, dayId, venueId, placeIds, userSubjectObject, dayBaseMoment

	var userId = 0
	var userRoles = []
	var event
	//console.log('Gametime')
	//console.dir(subjectObject)
remoteData.dataLoad
				.then(() => {
					if(subjectType === SET) return remoteData.Sets.subjectDetails(subjectObject)
					if(subjectType === DAY) return remoteData.Days.subjectDetails(subjectObject)
					if(subjectType === DATE) return remoteData.Dates.subjectDetails(subjectObject)
					throw new Error('Unexpected subjectType: ' + subjectType)
				})
				.then(() => console.log('date 104', remoteData.Sets.getDateId(3447)))
				.then(() => subjectType === subjectData.DATE ? subjectObject : {subject: subjectData.dates(subjectObject)[0] , subjectType: subjectData.DATE})
				.then(dso => {if(!dso || !dso.subject) throw new Error('No vslid dso for in' + JSON.stringify(subjectObject) + JSON.stringify(subjectData.dates(subjectObject)))})
				.then(() => Promise.all([
					auth.getFtUserId()
						.then(r => {if(!_.isEqual(userId, r)) return userId = r;})
						.then(r => Boolean(r))
						.catch(() => userId = 0)
				]))
				.then(() => {
					const checkedinDate = subjectData.checkedIn(userSubjectObject, {date:true})
			//console.log('Gametime oninit checkedinDate', checkedinDate)
			
			const checkedinDateActive = subjectData.active(checkedinDate)
			const nonCheckinDates = !checkedinDateActive && subjectData.dates(subjectObject)
			const altId = subjectType === 8 && subject || nonCheckinDates && nonCheckinDates.length && nonCheckinDates[0].id
			//console.log('Gametime oninit 2')

			dateId = checkedinDateActive ? checkedinDate.subject : altId
			//console.log('Gametime oninit dateId', dateId)
			
				//gameTimeDay
			const possibleDays = dateId && subjectData.days({
				subject: dateId,
				subjectType: subjectData.DATE

			})
				.sort((a, b) => a.daysOffset - b.daysOffset)
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
				possibleDays && possibleDays.length ? possibleDays[possibleDays.length - 1].id :
				0
				})
				.catch(console.error)
	return {
		view: (vnode) =>
			<div class="main-stage-gametime">
			<GametimeBanner 
				title={`gametime`} 
				dateId={dateId}
				dayId={dayId}
			
			/>
				<div class="main-stage-gametime-content-scroll">
				{
					/locations/.test(m.route.get()) ? <Locations dateId={dateId} dayId={dayId} subjectObject={subjectObject} /> :
					subjectType === 9 ? <Schedule dateId={dateId} dayId={dayId} subjectObject={subjectObject}/> : 
					subjectType === 8 ? <NowPlaying dateId={dateId} dayId={dayId} subjectObject={subjectObject}/> : 
					<SetDetail dateId={dateId} dayId={dayId} subjectObject={subjectObject}/> 
				}
				</div>
			</div>
}};

export default Gametime;