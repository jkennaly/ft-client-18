// src/components/widgets/CloudinaryUpload.jsx


import m from 'mithril'

import {subjectData} from '../../store/subjectData.js'

const CloudinaryUploadWidget = vnode => {
	var myUploadWidget = {}
	return {
		oncreate: vnode => {
		    myUploadWidget = cloudinary.openUploadWidget({ 
		      cloudName: 'dbezrymmc', 
		      uploadPreset: subjectData.imagePreset(vnode.attrs.subjectType),
		      sources: vnode.attrs.sources
		  }, (err, result) => {
		      	//console.log('Cloudinary Upload')
		      	if(err) console.log(err)
		      	if(vnode.attrs.resultFunction) 
		      	if (result.event === "success") {
                    //Step 2.4:  Call the .close() method in order to close the widget
                    vnode.attrs.resultFunction(result)
                    myUploadWidget.close();
                }
		       })
		    if(vnode.attrs.widgetHandle) vnode.attrs.widgetHandle(myUploadWidget)
		    
		  },
		view: (vnode) => <input type="button" />
}};

export default CloudinaryUploadWidget;