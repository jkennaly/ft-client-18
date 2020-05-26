// src/store/list/mixins/event/img.js
import _ from 'lodash'
export default ({dates, sets}, lineups) => { return  {
	forDateAll (dateId) {
		const scheduledArtistIds = _.uniq(sets.getMany(dates.getSubSetIds(dateId))
            .map(s => s.band))

        const scheduledImgs = this.getFiltered(i => i.subjectType === ARTIST && scheduledArtistIds.includes(i.subject) )
    	if(scheduledImgs.length) return scheduledImgs
        //need artist id from festival lineup that has an image
        return this.getFiltered(i => i.subjectType === ARTIST && lineups.find(l => l.band === i.subject && l.festival === _.get(dates.get(dateId), 'festival', 0)))
   
	},
	forDateSingle (dateId) {
		const scheduledArtistIds = _.uniq(sets.getMany(dates.getSubSetIds(dateId))
            .map(s => s.band))

        const scheduledImg = this.find(i => i.subjectType === ARTIST && scheduledArtistIds.includes(i.subject) )
    	if(scheduledImg) return scheduledImg
        //need artist id from festival lineup that has an image
    const festivalId = dates.getFestivalId(dateId)
    const lineupImage = this.find(i => i.subjectType === ARTIST && lineups.find(l => l.band === i.subject && l.festival === festivalId))
        //console.log('img forDateSingle lineupImage', dateId, lineupImage, festivalId)
        return lineupImage
   
	},
	
}}