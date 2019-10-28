// artist.js

import _ from 'lodash'
//a subject and a message are connected if:

//message is about the subject

export default ({lineups, festivals}) => { return  {
	messageEventConnection (e) { return m => {
		const same = m.subjectType === e.subjectType && m.subject === e.subject
		if(same) return true
		if(!mValid) return false
		const mValid = m.subjectType === 2
		const artistFestivals = lineups.festivalsForArtist(m.subject)
			.map(id => festivals.getSubjectObject(id))
		const retVal = mValid && _.find(
			artistFestivals, 
			f => festivals.messageEventConnection(e)(f)
		)
		//console.log('remoteData.Artists.messageEventConnection')
		//console.log('mValid')
		//console.log(mValid)
		//console.log('artistFestivals')
		//console.log(artistFestivals)
		//console.log('retVal')
		//console.log(retVal)

		return retVal
	}
		

		
	}  }
}