// leveled.js
import _ from 'lodash'

export default {
	getLevel (id) { 
		return _.get(this.get(id), 'level')
	},
	peakLevel () {
		return _.min(this.list.map(x => x.level))
	},
	troughLevel () {
		return _.max(this.list.map(x => x.level))
	}
}