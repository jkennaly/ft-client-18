// ImageModal.jsx


import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

// change selections
import UIButton from '../ui/UIButton.jsx';
import CloudinaryUploadWidget from '../widgets/CloudinaryUpload.jsx'

const classes = attrs => 'ft-modal ' + (attrs.display ? '' : 'hidden')
    var widgetExists = false
    var title = ''
    var author = ''
    var sourceUrl = ''
    var license = ''
    var licenseUrl = ''
    var licenseSelect = ''
    var licenses = []
    const validated = () => {
        //console.log('ImageModal validated', title , author , sourceUrl , license , licenseUrl)
        return title && author && sourceUrl && license && licenseUrl
    }
const ImageModal = {
    oninit: ({attrs}) => {
        //console.log('ImageModal init', attrs)
        title = attrs.phTitle
        author = attrs.phCreator
        sourceUrl = attrs.phSourceUrl
        licenses = _.uniqBy(remoteData.Images.list,
            img => img.licenseUrl
        )
        license = licenses.length ? licenses[0].license : license
        licenseUrl = licenses.length ? licenses[0].licenseUrl : licenseUrl
        licenseSelect = <div class="ft-name-field">
        <label for="license">
            {`License Name`}
        </label>
            <select id="ft-license-selector" name="license" onchange={e => {
                license = e.target.innerHTML
                licenseUrl = e.target.value
                e.stopPropagation()
            }}>
                {
                    licenses
                        .map((s, i) => <option selected={!i} value={s.licenseUrl}>{s.license}</option>)
                }
            </select>
    </div>
    },
    /*
    onbeforeupdate: ({attrs}) => {
        if(!attrs.existingLicense) return
        title = attrs.phTitle
        author = attrs.phCreator
        sourceUrl = attrs.phSourceUrl
        licenses = _.uniqBy(remoteData.Images.list,
                        img => img.licenseUrl
                    )
        license = licenses.length ? licenses[0].license : license
        licenseUrl = licenses.length ? licenses[0].licenseUrl : licenseUrl

    },
    */
    view: ({attrs}) => <div class={classes(attrs)}>
        <div class="ft-modal-content">
            <h1>Add {subjectData.name(attrs.subject, attrs.subjectType)} Image</h1>
            <div>Image Title</div>
            <input type="text" 
                onchange={e => {title = e.target.value;}}
            />
            <div>Image Creator</div>
            <input type="text" 
                onchange={e => {author = e.target.value;}}
            />
            <div>Image Source URL</div>
            <input type="text" 
                onchange={e => {sourceUrl = e.target.value;}}
            />

            {
                attrs.existingLicense ? licenseSelect : <div>
                    <div>Image License</div>
                    <input type="text" onchange={e => license = e.target.value}/>
                    <div>License URL</div>
                    <input type="text" onchange={e => licenseUrl = e.target.value}/>  
                </div>
            }


            <UIButton action={e => {
                attrs.hide()

            }} buttonName="Cancel" />
            <UIButton action={validated() ? e => {

                widgetExists = true

                
            } : e => 0} buttonName={validated() ? "Accept" : "Enter image origin"} />
            {widgetExists ? <CloudinaryUploadWidget 
                subject={attrs.subject}
                subjectType={attrs.subjectType}
                sources={attrs.sources}
                resultFunction={result => {
                    //fail silently
                    if(!result) return
                    //console.log(result)
                    if(result[0].secure_url.indexOf('image' > 0)) {
                        attrs.action({
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
}

export default ImageModal;