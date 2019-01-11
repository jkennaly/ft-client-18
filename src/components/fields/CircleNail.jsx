// CircleNail.jsx

import m from 'mithril'
import _ from 'lodash'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import {remoteData} from '../../store/data.js'

var pathCache = {}
const CircleNail = vnode => {
    const cl = cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
    var images = []
    var addingImage = false
    var userId = 0
    var sub = '' + vnode.attrs.subject + '-' + vnode.attrs.subjectType + '-' + remoteData.Images.list.length
    var imagePath = ''
    const initDom = vnode => {
        const newSub = '' + vnode.attrs.subject + '-' + vnode.attrs.subjectType + '-' + remoteData.Images.list.length
        const cached = _.get(pathCache, newSub)
        const skipImageCheck = !remoteData.Images.list.length || _.isString(cached) && cached === imagePath && sub === newSub || !vnode.attrs.subject
        //console.log('CircleNail initDom sub ' + sub)
        if(false && vnode.attrs.subject === 1230) {
            console.log('CircleNail initDom newSub ' + newSub)
            console.log('CircleNail initDom sub ' + sub)
            console.log('CircleNail initDom imagePath ' + imagePath)
            console.log('CircleNail initDom cached ' + _.isString(cached))
            console.log('CircleNail initDom Images count ' + remoteData.Images.list.length)
            console.log('CircleNail initDom skipImageCheck ' + skipImageCheck)

        }
        
        if(skipImageCheck) return
        if(_.isString(cached)) {
            sub = '' + newSub
            imagePath = cached
            m.redraw()
            return
        }
        if(false && vnode.attrs.subject === 1230) console.log('CircleNail imagecheck for newSub ' + newSub)
        images = remoteData.Images.forSubject(vnode.attrs.subjectType, vnode.attrs.subject)
            .filter(i => i.url)
        const prevPath = imagePath
        if(images.length) imagePath = images[0].url.substring(images[0].url.indexOf('artists/'))
        if(!images.length) imagePath = ''
        if(false && vnode.attrs.subject === 1230) {
        console.log('CircleNail')
        console.log('CircleNail initDom newSub ' + newSub)
        console.log(imagePath)
        console.log(images)
    }
        sub = '' + newSub
        if(imagePath !== prevPath){
            _.set(pathCache, sub, imagePath)
            m.redraw()
        } 
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