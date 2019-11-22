// dateWithDays.js



import provide from '../../../loading/provide'

export default (days) => { return  {
	createWithDays (data) { 
		const end = `/api/${this.fieldName}/createWithDays/`
			//console.log('createWithDays ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => Promise.all[days.remoteCheck(true), this.remoteCheck(true)])
				.then(() => this.getFiltered(data))
	}  
}}