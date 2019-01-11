// UserAvatarField.jsx
//attrs: userId

import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data';


const UserAvatarField = vnode => {
  var author = ''
  var src = ''
  const initDom = ({attrs}) => {
    if(author) return
    const u = attrs.data
    const s = remoteData.Users.getPic(u)
    const newAuthor = remoteData.Users.getName(u)
    const authorChange = newAuthor !== author
    const srcChange = src !== s
    author = newAuthor ? newAuthor : author
    src = s ? s : src
    //console.log('UserAvatarField author ' + author)
    //console.log('UserAvatarField authorChange ' + authorChange)
    //console.log('UserAvatarField src ' + src)
    //console.log(attrs.data)
    if(authorChange || srcChange) m.redraw()
  }

	return {
		oninit: remoteData.Users.loadList,
	    oncreate: initDom,
	    onupdate: initDom,
		view: ({ attrs }) => <div class="ft-horizontal-fields">
			<img src={src} />
			<div class="ft-vertical-fields">
	            <span>{author}</span>
	            
	        </div>
        </div>
}} ;

export default UserAvatarField;