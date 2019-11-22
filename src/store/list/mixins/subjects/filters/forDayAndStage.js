// forDayAndStage.js

import _ from 'lodash'

export default {
	forDayAndStage (dayId, stageId) { 
		return this.getFiltered(s => s.day === dayId && s.stage === stageId)
	}  
}