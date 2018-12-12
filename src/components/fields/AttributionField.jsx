// AttributionField.jsx

import m from 'mithril'

import {remoteData} from '../../store/data'

const AttributionField = vnode => {
	var attrAr = []
	//[title, sourceUrl, author, license, licenseUrl]
	return {
		oninit: ({ attrs }) => attrAr = remoteData.Images.getAttributionAr(attrs.imageId),
		view: ({ attrs }) => <span class="ft-image-attribution">
			<a href={attrAr[1]} target="blank">{attrAr[0]} by {attrAr[2]}</a>
			 //  
			<a href={attrAr[4]} target="blank">{attrAr[3]}</a>
		</span>
}};

export default AttributionField;