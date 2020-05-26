// apiList.js

import DataList from '../DataList'

function ApiList(opt = {
	url: 'https://jsonplaceholder.typicode.com/users', 
	fieldName: 'Users'
}) {
  DataList.call(this, opt)
  this.subjectType = 6
  this.idField = 'users'
}
ApiList.prototype = Object.create(DataList.prototype)

export default ApiList