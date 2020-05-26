// artist.js

import _ from 'lodash'
//a subject and a message are connected if:

//message is about the subject

export default ({lineups, festivals}) => { return  {
	messageEventConnection (e) { return m => {
		//an artist object (e) is connected to a message (m) if the message is about the artist
		return false
	}
		

		
	}  }
}