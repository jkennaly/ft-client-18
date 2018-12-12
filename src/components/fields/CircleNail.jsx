// CircleNail.jsx

import m from 'mithril'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import {remoteData} from '../../store/data.js'

const CircleNail = vnode => {
    const cl = cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
    var imagePath = ''
    var prevPath = ''
    var images = []
    var addingImage = false
    var userId = 0
    const initDom = vnode => {
        if(images.length) return
        images = remoteData.Images.forSubject(vnode.attrs.subjectType, vnode.attrs.subject)
            .filter(i => i.url)
        if(images.length) imagePath = images[0].url.substring(images[0].url.indexOf('artists/'))
        //console.log('CircleNail')
        //console.log(imagePath)
        //console.log(images)
        if(images.length) m.redraw()
    }
    return {
        oninit: function (vnode) {
            remoteData.Images.loadList()
        },
        oncreate: initDom,
        onupdate: initDom,
        view: vnode => <div class="ft-card-thumbnail">
            {imagePath ? 
                m.trust(cl.imageTag(imagePath, {
                    alt: "artist image", 
                    width: 50, 
                    height: 50,
                    crop: "thumb", 
                    radius: 'max'}).toHtml()) : 
            ''}
      </div>
}}

export default CircleNail;