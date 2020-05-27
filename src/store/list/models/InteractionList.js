// interaction.js

import DataList from '../DataList'

function InteractionList(opt = {fieldName: 'Interactions'}) {
  DataList.call(this, opt)
  this.core = false
}
InteractionList.prototype = Object.create(DataList.prototype)

export default InteractionList