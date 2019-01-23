// CloudImageField.jsx

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

import m from 'mithril'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import AttributionField from './AttributionField.jsx'
import NavButton from '../ui/NavButton.jsx'
import ImageModal from '../modals/ImageModal.jsx'

import {remoteData, subjectData} from '../../store/data.js'

const CloudImageField = vnode => {
    const cl = cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
    var imagePath = ''
    var images = []
    var addingImage = false
    var userId = 0
    const initDom = vnode => {
        images = remoteData.Images.forSubject(vnode.attrs.subjectType, vnode.attrs.subject)
            .filter(i => i.url)
        imagePath = images.length ? images[0].url.substring(images[0].url.indexOf('artists/')) : 'artists/nvfejb2psaelknnxv1zg.jpg'    
        //console.log('CloudImageField')
        //console.log(imagePath)
        //console.log(images)
    }
    return {
        oninit: function (vnode) {
            auth.getFtUserId()
                .then(id => userId = id)
                .then(m.redraw)
                .catch(err => m.route.set('/auth'))
        },
        oncreate: initDom,
        onupdate: initDom,
        view: vnode => <div class="ft-full-image">

            {images.length && images[0].id ? m.trust(cl.imageTag(imagePath, {alt: "artist image", width: 288, height: 250, crop: "fit"}).toHtml()) : ''}
            {images.length && images[0].id ? <AttributionField imageId={images[0].id}/> : ''}
            {!images.length || !images[0].id ? <NavButton fieldValue="Add image" action={e => addingImage = true} /> : ''}
            {!images.length || !images[0].id ? <a 
                href={"https://www.google.com/search?q=" + encodeURIComponent(subjectData.name(vnode.attrs.subject, vnode.attrs.subjectType)) + "&hs=lbE&channel=fs&tbm=isch&source=lnt&tbs=sur:fc&sa=X"} 
                target="_blank"><NavButton fieldValue="Image Search" /></a> : ''}

                <ImageModal 
                    display={addingImage} 
                    hide={() => addingImage = false}
                    action={data => remoteData.Images.create(data)}
                    subject={vnode.attrs.subject}
                    subjectType={vnode.attrs.subjectType}
                    userId={userId}
                />
      </div>
}}

export default CloudImageField;