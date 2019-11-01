// SubjectTypeList.js

import DataList from '../DataList'

function SubjectTypeList(opt = {fieldName: 'SubjectTypes'}) {
  DataList.call(this, opt)
}
SubjectTypeList.prototype = Object.create(DataList.prototype)

export default SubjectTypeList