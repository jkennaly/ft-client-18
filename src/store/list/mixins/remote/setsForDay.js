// src/store/list/mixins/remote/dateWithDays.js


import provide from '../../../loading/provide'

export default {
	createForDays (daysObject) { 
		const end = `/api/${this.fieldName}/forDay/`
			//console.log('createWithDays ' + this.fieldName)
			//console.log(data)
			const dayData = Object.keys(daysObject)
				.map(day => { return {
						end: end + day,
						artistIds: daysObject[day]
					}})
			return Promise.all(dayData
					.map(data => provide(
						{artistIds: data.artistIds}, 
						this.fieldName, 
						'', 
						data.end)
					)
				)
				.then(() => this.remoteCheck(true))
	}  
}