// CloudImageField.jsx


import m from 'mithril'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import AttributionField from './AttributionField.jsx'
import NavButton from '../ui/NavButton.jsx'
import ImageModal from '../modals/ImageModal.jsx'

import Auth from '../../services/auth.js'
const auth = new Auth()

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

const CloudImageField = vnode => {
    const cl = cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
    var imagePath = ''
    var images = []
    var addingImage = false
    var usePlaceholders = false
    const initDom = vnode => {
        images = !images.length ? remoteData.Images.forSubject({subjectType: vnode.attrs.subjectType, subject: vnode.attrs.subject})
            .filter(i => i.url) : images
        imagePath = images.length ? images[0].url.substring(images[0].url.indexOf('artists/')) : 'artists/nvfejb2psaelknnxv1zg.jpg'    
        usePlaceholders = vnode.attrs.camera && auth.userId()
        //console.log('CloudImageField')
        //console.log(imagePath)
        //console.log(images)
    }
    return {
        oninit: initDom,
        onbeforeupdate: initDom,
        view: vnode => <div class="ft-full-image">

            {images.length && images[0].id ? m.trust(cl.imageTag(imagePath, {alt: "artist image", width: 288, height: 250, crop: "fit"}).toHtml()) : ''}
            {images.length && images[0].id ? <AttributionField imageId={images[0].id}/> : ''}
            {!vnode.attrs.addDisabled && (!images.length || !images[0].id) ? <NavButton fieldValue="Add image" action={e => addingImage = true} /> : ''}
            {(!images.length || !images[0].id) && !vnode.attrs.addDisabled && vnode.attrs.subjectType === 2 ? <a 
                href={"https://www.google.com/search?q=" + encodeURIComponent(subjectData.name(vnode.attrs.subject, vnode.attrs.subjectType)) + "+site%3Acommons.wikimedia.org&hs=lbE&channel=fs&tbm=isch&source=lnt&tbs=sur:fc&sa=X"} 
                target="_blank">
                <NavButton fieldValue="Image Search" />
                </a> : ''}
{
    
                !vnode.attrs.addDisabled && (!images.length || !images[0].id) ? <ImageModal 
                    display={addingImage} 
                    hide={() => addingImage = false}
                    action={data => remoteData.Images.create(data)}
                    subject={vnode.attrs.subject}
                    subjectType={vnode.attrs.subjectType}
                    sources={vnode.attrs.sources}
                    phTitle={usePlaceholders ? subjectData.name({
                        subject: vnode.attrs.subject,
                        subjectType: vnode.attrs.subjectType
                    }) : undefined}
                    phCreator={usePlaceholders ? subjectData.name({
                        subject: auth.userId(),
                        subjectType: subjectData.USER
                    }) : undefined}
                    phSourceUrl={usePlaceholders ? String(window.location).replace(/(gametime)/, 'image') + '/' + auth.userId() : undefined}
                    existingLicense={usePlaceholders}
                    camera={usePlaceholders}
                /> : ''
    
}
              
      </div>
}}

export default CloudImageField;