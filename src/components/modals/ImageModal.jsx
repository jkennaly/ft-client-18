// ImageModal.jsx


import m from 'mithril'
import _ from 'lodash'

import {remoteData, subjectData} from '../../store/data.js'

// change selections
import UIButton from '../ui/UIButton.jsx';
import CloudinaryUploadWidget from '../widgets/CloudinaryUpload.jsx'

const classes = attrs => 'modal ' + (attrs.display ? '' : 'hidden')
const ImageModal = vnode => {
    var widgetExists = false
    var title = ''
    var author = ''
    var sourceUrl = ''
    var license = ''
    var licenseUrl = ''
    const validated = () => {
        return title && author && sourceUrl && license && licenseUrl
    }
    return  {
        view: ({attrs}) => <div class={classes(attrs)}>
            <div class="modal-content">
                <h1>Add {subjectData.name(attrs.subject, attrs.subjectType)} Image</h1>
                <div>Image Title</div>
                <input type="text" onchange={e => title = e.target.value}/>
                <div>Image Creator</div>
                <input type="text" onchange={e => author = e.target.value}/>
                <div>Image Source URL</div>
                <input type="text" onchange={e => sourceUrl = e.target.value}/>
                <div>Image License</div>
                <input type="text" onchange={e => license = e.target.value}/>
                <div>License URL</div>
                <input type="text" onchange={e => licenseUrl = e.target.value}/>
                <UIButton action={e => {
                    attrs.hide()

                }} buttonName="Cancel" />
                <UIButton action={validated() ? e => {

                    widgetExists = true

                    
                } : e => 0} buttonName={validated() ? "Accept" : "Enter image origin"} />
                {widgetExists ? <CloudinaryUploadWidget 
                    subject={attrs.subject}
                    subjectType={attrs.subjectType}
                    widgetHandle={widget => widget.open(sourceUrl)}
                    resultFunction={result => {
                        //console.log(result)
                        if(result[0].secure_url.indexOf('image' > 0)) {
                            attrs.action({
                                user: attrs.userId,
                                subject: attrs.subject,
                                subjectType: attrs.subjectType,
                                url: result[0].secure_url,
                                title: title,
                                sourceUrl: sourceUrl,
                                author: author,
                                license: license,
                                licenseUrl: licenseUrl
                            })
                            widgetExists = false
                            attrs.hide()
                        }
                    }}
                /> : ''}
            </div>
        </div>
}}

export default ImageModal;