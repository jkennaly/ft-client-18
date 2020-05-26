// src/components/widgets/CloudinaryUpload.jsx


import m from 'mithril'

import {subjectData} from '../../store/subjectData.js'

const CloudinaryUploadWidget = vnode => {
	var myUploadWidget = {}
	return {
		oncreate: vnode => {
		    myUploadWidget = cloudinary.openUploadWidget({ 
		      cloud_name: 'dbezrymmc', 
		      upload_preset: subjectData.imagePreset(vnode.attrs.subjectType),
		      sources: vnode.attrs.sources
		  }, (err, result) => {
		      	//console.log('Cloudinary Upload')
		      	if(err) console.log(err)
		      	if(vnode.attrs.resultFunction) vnode.attrs.resultFunction(result)
		       })
		    if(vnode.attrs.widgetHandle) vnode.attrs.widgetHandle(myUploadWidget)

		  },
		view: (vnode) => <input type="button" />
}};

export default CloudinaryUploadWidget;