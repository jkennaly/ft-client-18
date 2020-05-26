// general.js


export default ({sets, days, dates, festivals}, messages) => { return  {
	implicit (so, userId) {
		//festival: any sub event
		//date: any sub event or the assoc festival if there is only one date
		//day: any sub event or the assoc date or the assoc festival
		const lastCheckin = remoteData.Messages.lastCheckin(userId)
		if(!lastCheckin) return false
		const directCheckin = so.subjectType === lastCheckin.subjectType && so.subject === lastCheckin.subject
		const peerCheckin = !directCheckin && so.subjectType === lastCheckin.subjectType
		const implicitCheckinPossible = !directCheckin && !peerCheckin && 
			[8, 9, 3].includes(lastCheckin.subjectType) &&
			[7, 8, 9].includes(so.subjectType)
		const eventActive = (
			so.subjectType === 3 && sets.active(so.subject) ||
			so.subjectType === 7 && festivals.activeDate(so.subject) ||
			so.subjectType === 8 && dates.active(so.subject) ||
			so.subjectType === 9 && days.active(so.subject)
		)
		if(!implicitCheckinPossible || !eventActive) return directCheckin && eventActive
		//date
		const date = lastCheckin.subjectType === 8 && so.subjectType === 7 && dates.getFestivalId(lastCheckin.subject) === so.subject
		//day
		const day = lastCheckin.subjectType === 9 && (
			so.subjectType === 7 && sets.getFestivalId(lastCheckin.subject) === so.subject ||
			so.subjectType === 8 && sets.getDateId(lastCheckin.subject) === so.subject
			
		)
		//set
		const set = lastCheckin.subjectType === 3 && (
			so.subjectType === 7 && sets.getFestivalId(lastCheckin.subject) === so.subject ||
			so.subjectType === 8 && sets.getDateId(lastCheckin.subject) === so.subject ||
			so.subjectType === 9 && sets.getDayId(lastCheckin.subject) === so.subject
		)
		
		return Boolean(date || day || set)
	}
}}