// lineup.js

import DataList from '../DataList'

function LineupList(opt = {fieldName: 'Lineups'}) {
  DataList.call(this, opt)
}
LineupList.prototype = Object.create(DataList.prototype)

export default LineupList