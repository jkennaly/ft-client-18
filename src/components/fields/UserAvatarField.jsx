// UserAvatarField.jsx
//attrs: userId

import m from 'mithril'
////import _ from 'lodash'

import {remoteData} from '../../store/data';


const UserAvatarField = vnode => {
  var author = ''
  var year = 2000
  var src = ''
  const initDom = ({attrs}) => {
    const u = attrs.data.fromuser
    const y = _.take(attrs.data.timestamp, 4)
    const s = remoteData.Users.getPic(u)
    const newAuthor = remoteData.Users.getName(u)
    author = u ? newAuthor : author
    year = y ? y : year
    src = s ? s : src
    if(!author && newAuthor) m.redraw()
  }

	return {
		oninit: remoteData.Users.loadList,
	    oncreate: initDom,
	    onupdate: initDom,
		view: ({ attrs }) => <div class="ft-horizontal-fields">
			<img src={src} />
			<div class="ft-vertical-fields">
	            <span>{author}</span>
	            <span>{year}</span>
	            
	        </div>
        </div>
}} ;

export default UserAvatarField;